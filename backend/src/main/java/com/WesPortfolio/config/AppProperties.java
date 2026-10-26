package com.WesPortfolio.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * All "app.*" settings from application.properties in one typed object.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Admin admin,
        Security security,
        Cors cors,
        Mail mail,
        Github github,
        Ai ai,
        Limits limits) {

    public record Admin(String username, String password) {
    }

    public record Security(String tokenSecret, int tokenHours, String ipSalt) {
    }

    public record Cors(List<String> allowedOrigins) {
    }

    public record Mail(String notifyTo, String from, boolean sendAcknowledgement) {
    }

    public record Github(String username, String token, int cacheMinutes) {
    }

    public record Ai(String baseUrl, String model, String apiKey, int timeoutSeconds, double minScore,
            int maxTokens, String reasoningEffort) {

        public boolean enabled() {
            return apiKey != null && !apiKey.isBlank() && baseUrl != null && !baseUrl.isBlank();
        }
    }

    public record Limits(int askPerHour, int contactPerHour) {
    }

    public int askPerHour() {
        return limits == null || limits.askPerHour() <= 0 ? 15 : limits.askPerHour();
    }

    public int contactPerHour() {
        return limits == null || limits.contactPerHour() <= 0 ? 5 : limits.contactPerHour();
    }
}
