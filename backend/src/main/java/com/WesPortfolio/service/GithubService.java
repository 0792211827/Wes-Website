package com.WesPortfolio.service;

import java.net.URI;
import java.net.URLEncoder;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.config.AppProperties;

/**
 * Fetches Wesley's public GitHub data on the server and caches it, so visitors never hit
 * GitHub's rate limit and the browser never has CORS problems.
 * The JSON is passed through unchanged; the Angular app reads the fields it needs and
 * falls back to sample data when this returns 503.
 */
@Service
public class GithubService {

    private static final Logger log = LoggerFactory.getLogger(GithubService.class);

    private record Cached(String body, Instant at) {
    }

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();
    private final Map<String, Cached> cache = new ConcurrentHashMap<>();
    private final AppProperties.Github github;

    public GithubService(AppProperties props) {
        this.github = props.github();
    }

    /** Public repositories, most recently pushed first. */
    public String repositories() {
        String user = username();
        return cached("repos:" + user,
                "https://api.github.com/users/" + enc(user) + "/repos?sort=pushed&per_page=12", true);
    }

    /** Daily contribution counts for the last year: { total: { lastYear }, contributions: [{ date, count, level }] }. */
    public String contributions() {
        String user = username();
        return cached("contrib:" + user,
                "https://github-contributions-api.jogruber.de/v4/" + enc(user) + "?y=last", false);
    }

    private String cached(String key, String url, boolean githubApi) {
        int minutes = github == null || github.cacheMinutes() <= 0 ? 30 : github.cacheMinutes();
        Cached c = cache.get(key);
        if (c != null && c.at().isAfter(Instant.now().minus(Duration.ofMinutes(minutes)))) {
            return c.body();
        }
        try {
            HttpRequest.Builder req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(12))
                    .header("Accept", githubApi ? "application/vnd.github+json" : "application/json")
                    .header("User-Agent", "wes-portfolio-api");
            String token = github == null ? null : github.token();
            if (githubApi && token != null && !token.isBlank()) {
                req.header("Authorization", "Bearer " + token.trim());
            }
            HttpResponse<String> res = http.send(req.GET().build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (res.statusCode() == 200) {
                cache.put(key, new Cached(res.body(), Instant.now()));
                return res.body();
            }
            log.warn("GitHub request {} returned {}", url, res.statusCode());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.warn("GitHub request {} failed: {}", url, e.getMessage());
        }
        if (c != null) {
            return c.body(); // serve the last good copy rather than nothing
        }
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "GitHub data is not available right now");
    }

    private String username() {
        String user = github == null ? null : github.username();
        if (user == null || !user.matches("[A-Za-z0-9-]{1,39}")) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "GitHub username is not configured");
        }
        return user;
    }

    private static String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
