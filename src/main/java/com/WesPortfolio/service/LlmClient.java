package com.WesPortfolio.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.WesPortfolio.config.AppProperties;

/**
 * Minimal client for any OpenAI-compatible chat completions endpoint
 * (Groq, OpenAI, Together, or a self-hosted vLLM server).
 * Used only when app.ai.api-key is set; every failure returns empty so the
 * caller can fall back to the extractive answer.
 */
@Component
public class LlmClient {

    private static final Logger log = LoggerFactory.getLogger(LlmClient.class);

    private final AppProperties.Ai ai;
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public LlmClient(AppProperties props) {
        this.ai = props.ai();
    }

    public boolean enabled() {
        return ai != null && ai.enabled();
    }

    public String model() {
        return ai == null || ai.model() == null ? "" : ai.model();
    }

    public Optional<String> chat(String systemPrompt, String userPrompt) {
        if (!enabled()) {
            return Optional.empty();
        }
        String base = ai.baseUrl().endsWith("/") ? ai.baseUrl().substring(0, ai.baseUrl().length() - 1) : ai.baseUrl();
        String body = "{"
                + "\"model\":" + JsonText.quote(model()) + ","
                + "\"temperature\":0.2,"
                + "\"max_tokens\":500,"
                + "\"messages\":["
                + "{\"role\":\"system\",\"content\":" + JsonText.quote(systemPrompt) + "},"
                + "{\"role\":\"user\",\"content\":" + JsonText.quote(userPrompt) + "}"
                + "]}";
        int timeout = ai.timeoutSeconds() <= 0 ? 20 : ai.timeoutSeconds();
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(base + "/chat/completions"))
                    .timeout(Duration.ofSeconds(timeout))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("Authorization", "Bearer " + ai.apiKey().trim())
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (res.statusCode() / 100 != 2) {
                log.warn("LLM call returned HTTP {}: {}", res.statusCode(), abbreviate(res.body()));
                return Optional.empty();
            }
            String content = JsonText.chatContent(res.body());
            if (content == null || content.isBlank()) {
                log.warn("LLM response had no content: {}", abbreviate(res.body()));
                return Optional.empty();
            }
            return Optional.of(content.trim());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (Exception e) {
            log.warn("LLM call failed: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private static String abbreviate(String s) {
        if (s == null) {
            return "";
        }
        return s.length() > 300 ? s.substring(0, 300) + "..." : s;
    }
}
