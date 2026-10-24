package com.WesPortfolio.dto;

import java.time.Instant;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Visitor tracking (POST /api/track) and the admin Workspace dashboard.
 */
public final class AnalyticsDtos {

    private AnalyticsDtos() {
    }

    /** Sent by the website for every page view and notable action. */
    public record TrackRequest(
            @Size(max = 40) String visitorId,
            @Size(max = 40) String sessionId,
            @NotBlank @Size(max = 30) String type,
            @Size(max = 300) String path,
            @Size(max = 200) String title,
            @Size(max = 500) String referrer,
            @Size(max = 300) String label,
            @Size(max = 20) String screen,
            @Size(max = 20) String language,
            @Size(max = 60) String timezone,
            /** For type "leave": the page view this duration belongs to. */
            Long refId,
            Long durationMs) {
    }

    public record TrackResponse(Long id) {
    }

    public record CountItem(String label, long count) {
    }

    public record DayPoint(String day, long visitors, long pageViews) {
    }

    public record Summary(
            int days,
            long visitors,
            long newVisitors,
            long sessions,
            long pageViews,
            long activeNow,
            long avgSessionSeconds,
            long avgPageSeconds,
            double bounceRate,
            long cvDownloads,
            long questions,
            long contacts,
            long outboundClicks,
            List<DayPoint> timeline,
            List<CountItem> topPages,
            List<CountItem> countries,
            List<CountItem> cities,
            List<CountItem> devices,
            List<CountItem> browsers,
            List<CountItem> systems,
            List<CountItem> referrers,
            List<CountItem> actions) {
    }

    /** One visit: everything a visitor did between arriving and leaving. */
    public record SessionDto(
            String sessionId,
            String visitorId,
            boolean returning,
            Instant start,
            Instant end,
            long durationSeconds,
            int pageViews,
            int events,
            String entryPage,
            String exitPage,
            String referrer,
            String ip,
            String country,
            String countryCode,
            String region,
            String city,
            Double latitude,
            Double longitude,
            String isp,
            String deviceType,
            String browser,
            String os,
            String screen,
            String language,
            String timezone,
            List<String> actions) {
    }

    public record EventDto(
            Long id,
            Instant at,
            String type,
            String path,
            String title,
            String label,
            Long durationMs,
            String referrer) {
    }

    public record SessionDetail(SessionDto session, List<EventDto> events, List<SessionDto> otherSessions) {
    }
}
