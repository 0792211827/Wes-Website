package com.WesPortfolio.service;

import java.net.URI;
import java.net.URLDecoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Approximate visitor location (country, region, city) from the IP address.
 *
 * 1. Vercel adds x-vercel-ip-* headers when it forwards a request; those are used when present.
 * 2. Otherwise the IP is looked up once at https://ipwho.is (free, no key) and cached for 24 hours.
 * Private and local addresses are never looked up.
 */
@Service
public class GeoService {

    private static final Logger log = LoggerFactory.getLogger(GeoService.class);
    private static final Duration TTL = Duration.ofHours(24);

    public record Geo(String country, String countryCode, String region, String city, Double latitude, Double longitude,
            String isp) {

        static final Geo UNKNOWN = new Geo(null, null, null, null, null, null, null);
        static final Geo LOCAL = new Geo("Local network", null, null, null, null, null, null);
    }

    private record Cached(Geo geo, Instant at) {
    }

    private final Map<String, Cached> cache = new ConcurrentHashMap<>();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
    private final boolean lookupEnabled;

    public GeoService(@Value("${app.analytics.geo-lookup:true}") boolean lookupEnabled) {
        this.lookupEnabled = lookupEnabled;
    }

    public Geo locate(String ip, HttpServletRequest request) {
        Geo fromHeaders = fromVercelHeaders(request);
        if (fromHeaders != null) {
            return fromHeaders;
        }
        if (ip == null || ip.isBlank() || isPrivate(ip)) {
            return Geo.LOCAL;
        }
        Cached c = cache.get(ip);
        if (c != null && c.at().isAfter(Instant.now().minus(TTL))) {
            return c.geo();
        }
        Geo geo = lookupEnabled ? lookup(ip) : Geo.UNKNOWN;
        if (cache.size() > 5000) {
            cache.clear();
        }
        cache.put(ip, new Cached(geo, Instant.now()));
        return geo;
    }

    private Geo fromVercelHeaders(HttpServletRequest request) {
        String country = request.getHeader("x-vercel-ip-country");
        if (country == null || country.isBlank()) {
            return null;
        }
        String city = decode(request.getHeader("x-vercel-ip-city"));
        String region = decode(request.getHeader("x-vercel-ip-country-region"));
        return new Geo(countryName(country), country, region, city,
                number(request.getHeader("x-vercel-ip-latitude")), number(request.getHeader("x-vercel-ip-longitude")), null);
    }

    private Geo lookup(String ip) {
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create("https://ipwho.is/" + ip))
                    .timeout(Duration.ofSeconds(4))
                    .header("Accept", "application/json")
                    .GET().build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            String json = res.body();
            if (res.statusCode() != 200 || json == null || json.contains("\"success\":false")) {
                return Geo.UNKNOWN;
            }
            int conn = json.indexOf("\"connection\"");
            return new Geo(
                    str(json, "country", 0),
                    str(json, "country_code", 0),
                    str(json, "region", 0),
                    str(json, "city", 0),
                    num(json, "latitude"),
                    num(json, "longitude"),
                    conn >= 0 ? str(json, "isp", conn) : null);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Geo.UNKNOWN;
        } catch (Exception e) {
            log.debug("Geo lookup failed for {}: {}", ip, e.getMessage());
            return Geo.UNKNOWN;
        }
    }

    /* ----------------------------- helpers ----------------------------- */

    static boolean isPrivate(String ip) {
        return ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("127.") || ip.equals("::1")
                || ip.startsWith("0:0:0:0:0:0:0:1") || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("169.254.")
                || ip.matches("^172\\.(1[6-9]|2\\d|3[01])\\..*") || ip.equals("unknown");
    }

    private static String str(String json, String field, int from) {
        int k = json.indexOf("\"" + field + "\"", from);
        if (k < 0) {
            return null;
        }
        int i = json.indexOf(':', k) + 1;
        while (i > 0 && i < json.length() && Character.isWhitespace(json.charAt(i))) {
            i++;
        }
        if (i <= 0 || i >= json.length() || json.charAt(i) != '"') {
            return null;
        }
        String v = JsonText.readString(json, i);
        return v == null || v.isBlank() ? null : v;
    }

    private static Double num(String json, String field) {
        int k = json.indexOf("\"" + field + "\"");
        if (k < 0) {
            return null;
        }
        int i = json.indexOf(':', k) + 1;
        int end = i;
        while (end < json.length() && "-+.0123456789eE ".indexOf(json.charAt(end)) >= 0) {
            end++;
        }
        return number(json.substring(i, end).trim());
    }

    private static Double number(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        try {
            return Double.parseDouble(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String decode(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        try {
            return URLDecoder.decode(s, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return s;
        }
    }

    private static String countryName(String code) {
        try {
            String name = new java.util.Locale("", code).getDisplayCountry(java.util.Locale.ENGLISH);
            return name == null || name.isBlank() ? code : name;
        } catch (Exception e) {
            return code;
        }
    }
}
