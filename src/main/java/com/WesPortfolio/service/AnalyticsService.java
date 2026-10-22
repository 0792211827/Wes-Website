package com.WesPortfolio.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.domain.VisitEvent;
import com.WesPortfolio.dto.AnalyticsDtos.CountItem;
import com.WesPortfolio.dto.AnalyticsDtos.DayPoint;
import com.WesPortfolio.dto.AnalyticsDtos.EventDto;
import com.WesPortfolio.dto.AnalyticsDtos.SessionDetail;
import com.WesPortfolio.dto.AnalyticsDtos.SessionDto;
import com.WesPortfolio.dto.AnalyticsDtos.Summary;
import com.WesPortfolio.dto.AnalyticsDtos.TrackRequest;
import com.WesPortfolio.repository.VisitEventRepository;
import com.WesPortfolio.security.RateLimiter;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Records what visitors do on the website and turns it into the admin Workspace:
 * visitors, sessions, pages, time on page, devices, browsers, locations and actions.
 *
 * Aggregation happens in memory over the selected period, which is simple and fast
 * for a portfolio-sized site (tens of thousands of events).
 */
@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
    private static final Set<String> TYPES = Set.of(
            "pageview", "leave", "cv_download", "outbound", "ask", "contact", "theme", "palette", "case_study", "lab", "post");

    private final VisitEventRepository events;
    private final GeoService geo;
    private final RateLimiter limiter = new RateLimiter(240, Duration.ofMinutes(10));
    private final int retentionDays;
    private final ZoneId zone;

    public AnalyticsService(VisitEventRepository events, GeoService geo,
            @Value("${app.analytics.retention-days:365}") int retentionDays,
            @Value("${app.analytics.timezone:Africa/Nairobi}") String timezone) {
        this.events = events;
        this.geo = geo;
        this.retentionDays = retentionDays <= 0 ? 365 : retentionDays;
        ZoneId z;
        try {
            z = ZoneId.of(timezone);
        } catch (Exception e) {
            z = ZoneId.of("UTC");
        }
        this.zone = z;
    }

    /* ------------------------------ recording ------------------------------ */

    /**
     * Saves one event and returns its id (used later to attach the time spent on a page).
     * Deliberately not one transaction: the location lookup must not hold a database connection.
     */
    public Long record(TrackRequest req, String ip, HttpServletRequest http) {
        if (!limiter.tryAcquire(ip == null ? "unknown" : ip)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many events");
        }
        String type = clean(req.type(), 30);
        if (type == null || !TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown event type");
        }

        if ("leave".equals(type)) {
            if (req.refId() != null && req.durationMs() != null && req.sessionId() != null) {
                long ms = Math.max(0, Math.min(req.durationMs(), Duration.ofHours(4).toMillis()));
                events.findByIdAndSessionId(req.refId(), req.sessionId()).ifPresent(e -> {
                    e.setDurationMs(ms);
                    events.save(e);
                });
            }
            return req.refId();
        }

        String ua = http.getHeader("User-Agent");
        UserAgentParser.Agent agent = UserAgentParser.parse(ua);
        GeoService.Geo g = geo.locate(ip, http);

        VisitEvent e = new VisitEvent();
        e.setVisitorId(clean(req.visitorId(), 40));
        e.setSessionId(clean(req.sessionId(), 40));
        e.setType(type);
        e.setPath(clean(req.path(), 300));
        e.setTitle(clean(req.title(), 200));
        e.setReferrer(cleanReferrer(req.referrer()));
        e.setLabel(clean(req.label(), 300));
        e.setScreen(clean(req.screen(), 20));
        e.setLanguage(clean(req.language(), 20));
        e.setClientTimezone(clean(req.timezone(), 60));
        e.setIp(clean(ip, 64));
        e.setUserAgent(clean(ua, 400));
        e.setBrowser(agent.browser());
        e.setBrowserVersion(agent.browserVersion());
        e.setOs(agent.os());
        e.setOsVersion(agent.osVersion());
        e.setDeviceType(agent.deviceType());
        e.setCountry(clean(g.country(), 80));
        e.setCountryCode(clean(g.countryCode(), 4));
        e.setRegion(clean(g.region(), 100));
        e.setCity(clean(g.city(), 100));
        e.setLatitude(g.latitude());
        e.setLongitude(g.longitude());
        e.setIsp(clean(g.isp(), 150));
        return events.save(e).getId();
    }

    /** Daily clean-up of events older than app.analytics.retention-days. */
    @Scheduled(cron = "0 30 3 * * *")
    @Transactional
    public void purgeOld() {
        long removed = events.deleteByCreatedAtBefore(Instant.now().minus(retentionDays, ChronoUnit.DAYS));
        if (removed > 0) {
            log.info("Removed {} visitor events older than {} days", removed, retentionDays);
        }
    }

    /* ------------------------------ dashboard ------------------------------ */

    @Transactional(readOnly = true)
    public Summary summary(int days) {
        int d = clampDays(days);
        Instant since = startOf(d);
        List<VisitEvent> all = humans(events.findByCreatedAtAfterOrderByCreatedAtDesc(since));
        List<VisitEvent> views = all.stream().filter(e -> "pageview".equals(e.getType())).toList();

        Set<String> visitors = all.stream().map(VisitEvent::getVisitorId).filter(Objects::nonNull).collect(Collectors.toSet());
        Set<String> returning = returningVisitors(visitors, since);
        Map<String, List<VisitEvent>> bySession = groupBySession(all);

        long totalSessionSeconds = 0;
        int bounces = 0;
        for (List<VisitEvent> s : bySession.values()) {
            totalSessionSeconds += sessionSeconds(s);
            if (s.stream().filter(e -> "pageview".equals(e.getType())).count() <= 1) {
                bounces++;
            }
        }
        long sessions = bySession.size();
        List<Long> pageDurations = views.stream().map(VisitEvent::getDurationMs).filter(Objects::nonNull).filter(ms -> ms > 0).toList();
        long avgPage = pageDurations.isEmpty() ? 0 : pageDurations.stream().mapToLong(Long::longValue).sum() / pageDurations.size() / 1000;

        Instant fiveMinAgo = Instant.now().minus(5, ChronoUnit.MINUTES);
        long activeNow = all.stream().filter(e -> e.getCreatedAt().isAfter(fiveMinAgo))
                .map(VisitEvent::getSessionId).filter(Objects::nonNull).distinct().count();

        return new Summary(
                d,
                visitors.size(),
                visitors.size() - returning.size(),
                sessions,
                views.size(),
                activeNow,
                sessions == 0 ? 0 : totalSessionSeconds / sessions,
                avgPage,
                sessions == 0 ? 0 : Math.round(bounces * 1000.0 / sessions) / 1000.0,
                count(all, "cv_download"),
                count(all, "ask"),
                count(all, "contact"),
                count(all, "outbound"),
                timeline(all, d),
                top(views, e -> pagePath(e.getPath()), 12),
                topBySession(bySession, e -> e.getCountry(), 12),
                topBySession(bySession, e -> e.getCity() == null ? null : e.getCity() + (e.getCountryCode() == null ? "" : ", " + e.getCountryCode()), 12),
                topBySession(bySession, VisitEvent::getDeviceType, 6),
                topBySession(bySession, VisitEvent::getBrowser, 8),
                topBySession(bySession, VisitEvent::getOs, 8),
                topBySession(bySession, e -> referrerHost(e.getReferrer()), 10),
                top(all.stream().filter(e -> !"pageview".equals(e.getType())).toList(), e -> actionLabel(e), 12));
    }

    @Transactional(readOnly = true)
    public List<SessionDto> sessions(int days, int limit, String search) {
        int d = clampDays(days);
        Instant since = startOf(d);
        List<VisitEvent> all = humans(events.findByCreatedAtAfterOrderByCreatedAtDesc(since));
        Map<String, List<VisitEvent>> bySession = groupBySession(all);
        Set<String> visitors = all.stream().map(VisitEvent::getVisitorId).filter(Objects::nonNull).collect(Collectors.toSet());
        Set<String> returning = returningVisitors(visitors, since);
        Map<String, Instant> firstSeen = firstSessionStart(bySession);

        String q = search == null ? "" : search.trim().toLowerCase();
        return bySession.values().stream()
                .map(s -> toSession(s, returning.contains(s.get(0).getVisitorId())
                        || isLaterSession(s, firstSeen)))
                .filter(s -> q.isEmpty() || matches(s, q))
                .sorted(Comparator.comparing(SessionDto::end).reversed())
                .limit(Math.max(1, Math.min(limit, 1000)))
                .toList();
    }

    @Transactional(readOnly = true)
    public SessionDetail session(String sessionId) {
        List<VisitEvent> list = events.findBySessionIdOrderByCreatedAtAsc(sessionId);
        if (list.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found");
        }
        String visitorId = list.get(0).getVisitorId();
        List<SessionDto> others = new ArrayList<>();
        if (visitorId != null) {
            Map<String, List<VisitEvent>> visitorSessions = groupBySession(
                    events.findTop500ByVisitorIdOrderByCreatedAtDesc(visitorId));
            visitorSessions.remove(sessionId);
            others = visitorSessions.values().stream().map(s -> toSession(s, true))
                    .sorted(Comparator.comparing(SessionDto::end).reversed()).toList();
        }
        List<EventDto> evs = list.stream().map(e -> new EventDto(e.getId(), e.getCreatedAt(), e.getType(), e.getPath(),
                e.getTitle(), e.getLabel(), e.getDurationMs(), e.getReferrer())).toList();
        return new SessionDetail(toSession(list, !others.isEmpty()), evs, others);
    }

    /* ------------------------------ helpers ------------------------------ */

    private SessionDto toSession(List<VisitEvent> raw, boolean returning) {
        List<VisitEvent> s = raw.stream().sorted(Comparator.comparing(VisitEvent::getCreatedAt)).toList();
        VisitEvent first = s.get(0);
        VisitEvent last = s.get(s.size() - 1);
        List<VisitEvent> views = s.stream().filter(e -> "pageview".equals(e.getType())).toList();
        VisitEvent geoSource = s.stream().filter(e -> e.getCountry() != null).findFirst().orElse(first);
        List<String> actions = s.stream().filter(e -> !"pageview".equals(e.getType()))
                .map(this::actionLabel).distinct().limit(8).toList();
        String referrer = s.stream().map(VisitEvent::getReferrer).filter(r -> r != null && !r.isBlank()).findFirst().orElse(null);
        return new SessionDto(
                first.getSessionId(),
                first.getVisitorId(),
                returning,
                first.getCreatedAt(),
                last.getCreatedAt(),
                sessionSeconds(s),
                views.size(),
                s.size(),
                views.isEmpty() ? null : views.get(0).getPath(),
                views.isEmpty() ? null : views.get(views.size() - 1).getPath(),
                referrer,
                first.getIp(),
                geoSource.getCountry(),
                geoSource.getCountryCode(),
                geoSource.getRegion(),
                geoSource.getCity(),
                geoSource.getLatitude(),
                geoSource.getLongitude(),
                geoSource.getIsp(),
                first.getDeviceType(),
                join(first.getBrowser(), first.getBrowserVersion()),
                join(first.getOs(), first.getOsVersion()),
                first.getScreen(),
                first.getLanguage(),
                first.getClientTimezone(),
                actions);
    }

    /** Session length: first to last event, plus the time spent on the last page if known. */
    private static long sessionSeconds(List<VisitEvent> s) {
        Instant min = null;
        Instant max = null;
        long lastPageMs = 0;
        Instant lastPageAt = null;
        for (VisitEvent e : s) {
            if (min == null || e.getCreatedAt().isBefore(min)) {
                min = e.getCreatedAt();
            }
            if (max == null || e.getCreatedAt().isAfter(max)) {
                max = e.getCreatedAt();
            }
            if ("pageview".equals(e.getType()) && (lastPageAt == null || e.getCreatedAt().isAfter(lastPageAt))) {
                lastPageAt = e.getCreatedAt();
                lastPageMs = e.getDurationMs() == null ? 0 : e.getDurationMs();
            }
        }
        if (min == null) {
            return 0;
        }
        return Duration.between(min, max).getSeconds() + lastPageMs / 1000;
    }

    private Map<String, List<VisitEvent>> groupBySession(List<VisitEvent> list) {
        Map<String, List<VisitEvent>> map = new LinkedHashMap<>();
        for (VisitEvent e : list) {
            String key = e.getSessionId() != null ? e.getSessionId() : "anon-" + e.getId();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(e);
        }
        return map;
    }

    /** Visitors in the period who were also seen before it. */
    private Set<String> returningVisitors(Set<String> visitors, Instant since) {
        if (visitors.isEmpty()) {
            return Set.of();
        }
        Set<String> result = new HashSet<>();
        Instant olderThan = since.minus(retentionDays, ChronoUnit.DAYS);
        for (VisitEvent e : events.findByCreatedAtAfterOrderByCreatedAtDesc(olderThan)) {
            if (e.getCreatedAt().isBefore(since) && e.getVisitorId() != null && visitors.contains(e.getVisitorId())) {
                result.add(e.getVisitorId());
            }
        }
        return result;
    }

    private static Map<String, Instant> firstSessionStart(Map<String, List<VisitEvent>> bySession) {
        Map<String, Instant> first = new HashMap<>();
        for (List<VisitEvent> s : bySession.values()) {
            for (VisitEvent e : s) {
                if (e.getVisitorId() == null) {
                    continue;
                }
                first.merge(e.getVisitorId(), e.getCreatedAt(), (a, b) -> a.isBefore(b) ? a : b);
            }
        }
        return first;
    }

    private static boolean isLaterSession(List<VisitEvent> s, Map<String, Instant> firstSeen) {
        VisitEvent any = s.get(0);
        if (any.getVisitorId() == null) {
            return false;
        }
        Instant start = s.stream().map(VisitEvent::getCreatedAt).min(Instant::compareTo).orElse(any.getCreatedAt());
        Instant first = firstSeen.get(any.getVisitorId());
        return first != null && start.isAfter(first);
    }

    private List<DayPoint> timeline(List<VisitEvent> all, int days) {
        Map<LocalDate, Set<String>> visitors = new LinkedHashMap<>();
        Map<LocalDate, Long> views = new HashMap<>();
        LocalDate today = LocalDate.now(zone);
        for (int i = days - 1; i >= 0; i--) {
            visitors.put(today.minusDays(i), new LinkedHashSet<>());
        }
        for (VisitEvent e : all) {
            LocalDate day = e.getCreatedAt().atZone(zone).toLocalDate();
            Set<String> set = visitors.get(day);
            if (set == null) {
                continue;
            }
            if (e.getVisitorId() != null) {
                set.add(e.getVisitorId());
            }
            if ("pageview".equals(e.getType())) {
                views.merge(day, 1L, Long::sum);
            }
        }
        List<DayPoint> out = new ArrayList<>();
        visitors.forEach((day, set) -> out.add(new DayPoint(day.toString(), set.size(), views.getOrDefault(day, 0L))));
        return out;
    }

    private static List<CountItem> top(List<VisitEvent> list, Function<VisitEvent, String> key, int limit) {
        Map<String, Long> counts = new HashMap<>();
        for (VisitEvent e : list) {
            String k = key.apply(e);
            if (k != null && !k.isBlank()) {
                counts.merge(k, 1L, Long::sum);
            }
        }
        return sorted(counts, limit);
    }

    /** Counts sessions (not events) per value, using the first event of each session. */
    private static List<CountItem> topBySession(Map<String, List<VisitEvent>> bySession, Function<VisitEvent, String> key, int limit) {
        Map<String, Long> counts = new HashMap<>();
        for (List<VisitEvent> s : bySession.values()) {
            String k = s.stream().map(key).filter(v -> v != null && !v.isBlank()).findFirst().orElse(null);
            counts.merge(k == null ? "Unknown" : k, 1L, Long::sum);
        }
        return sorted(counts, limit);
    }

    private static List<CountItem> sorted(Map<String, Long> counts, int limit) {
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(en -> new CountItem(en.getKey(), en.getValue()))
                .toList();
    }

    private String actionLabel(VisitEvent e) {
        return switch (e.getType()) {
            case "cv_download" -> "Downloaded CV";
            case "outbound" -> "Opened " + (e.getLabel() == null ? "a link" : e.getLabel());
            case "ask" -> "Asked the AI";
            case "contact" -> "Sent the contact form";
            case "theme" -> "Switched theme";
            case "palette" -> "Used the command menu";
            default -> e.getType();
        };
    }

    private static boolean matches(SessionDto s, String q) {
        return contains(s.ip(), q) || contains(s.country(), q) || contains(s.city(), q) || contains(s.browser(), q)
                || contains(s.os(), q) || contains(s.deviceType(), q) || contains(s.entryPage(), q)
                || contains(s.referrer(), q) || contains(s.visitorId(), q);
    }

    private static boolean contains(String v, String q) {
        return v != null && v.toLowerCase().contains(q);
    }

    private static List<VisitEvent> humans(List<VisitEvent> list) {
        return list.stream().filter(e -> !"bot".equals(e.getDeviceType())).toList();
    }

    private static long count(List<VisitEvent> list, String type) {
        return list.stream().filter(e -> type.equals(e.getType())).count();
    }

    private Instant startOf(int days) {
        return LocalDate.now(zone).minusDays(days - 1L).atStartOfDay(zone).toInstant();
    }

    private static int clampDays(int days) {
        return Math.max(1, Math.min(days, 365));
    }

    private static String pagePath(String path) {
        if (path == null || path.isBlank()) {
            return "/";
        }
        int q = path.indexOf('?');
        return q >= 0 ? path.substring(0, q) : path;
    }

    static String referrerHost(String ref) {
        if (ref == null || ref.isBlank()) {
            return "Direct";
        }
        try {
            String host = java.net.URI.create(ref.trim()).getHost();
            if (host == null) {
                return "Direct";
            }
            return host.startsWith("www.") ? host.substring(4) : host;
        } catch (IllegalArgumentException e) {
            return "Other";
        }
    }

    private static String cleanReferrer(String ref) {
        String r = clean(ref, 500);
        return r == null || r.isBlank() ? null : r;
    }

    private static String clean(String s, int max) {
        if (s == null) {
            return null;
        }
        String t = s.replaceAll("[\\p{Cntrl}]", "").trim();
        if (t.isEmpty()) {
            return null;
        }
        return t.length() > max ? t.substring(0, max) : t;
    }

    private static String join(String a, String b) {
        if (a == null) {
            return null;
        }
        return b == null || b.isBlank() ? a : a + " " + b;
    }
}
