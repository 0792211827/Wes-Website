package com.WesPortfolio.service;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Small, dependency-free User-Agent reader: browser, operating system and device type.
 * Good enough for analytics; it does not try to identify every exotic browser.
 */
public final class UserAgentParser {

    public record Agent(String browser, String browserVersion, String os, String osVersion, String deviceType) {
    }

    private static final Pattern BOT = Pattern.compile(
            "bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|headless|lighthouse|"
                    + "pingdom|uptime|monitor|curl/|wget|python-requests|okhttp|java/|go-http|axios|node-fetch|postman",
            Pattern.CASE_INSENSITIVE);

    private UserAgentParser() {
    }

    public static Agent parse(String ua) {
        if (ua == null || ua.isBlank()) {
            return new Agent("Unknown", "", "Unknown", "", "unknown");
        }
        String browser = "Other";
        String bv = "";
        String[][] browsers = {
                {"Edg/", "Edge"}, {"EdgA/", "Edge"}, {"EdgiOS/", "Edge"}, {"OPR/", "Opera"}, {"Opera/", "Opera"},
                {"SamsungBrowser/", "Samsung Internet"}, {"Firefox/", "Firefox"}, {"FxiOS/", "Firefox"},
                {"CriOS/", "Chrome"}, {"Chrome/", "Chrome"}, {"Version/", "Safari"}
        };
        for (String[] b : browsers) {
            int i = ua.indexOf(b[0]);
            if (i >= 0) {
                if (b[1].equals("Safari") && !ua.contains("Safari")) {
                    continue;
                }
                browser = b[1];
                bv = version(ua, i + b[0].length());
                break;
            }
        }

        String os = "Other";
        String ov = "";
        Matcher m;
        if ((m = Pattern.compile("Windows NT ([\\d.]+)").matcher(ua)).find()) {
            os = "Windows";
            ov = switch (m.group(1)) {
                case "10.0" -> "10/11";
                case "6.3" -> "8.1";
                case "6.2" -> "8";
                case "6.1" -> "7";
                default -> m.group(1);
            };
        } else if ((m = Pattern.compile("(?:iPhone|CPU) OS ([\\d_]+)").matcher(ua)).find()) {
            os = ua.contains("iPad") ? "iPadOS" : "iOS";
            ov = m.group(1).replace('_', '.');
        } else if ((m = Pattern.compile("Android ([\\d.]+)").matcher(ua)).find()) {
            os = "Android";
            ov = m.group(1);
        } else if ((m = Pattern.compile("Mac OS X ([\\d_.]+)").matcher(ua)).find()) {
            os = "macOS";
            ov = m.group(1).replace('_', '.');
        } else if (ua.contains("CrOS")) {
            os = "ChromeOS";
        } else if (ua.contains("Linux")) {
            os = "Linux";
        }

        String lower = ua.toLowerCase(Locale.ROOT);
        String device;
        if (BOT.matcher(ua).find()) {
            device = "bot";
        } else if (lower.contains("ipad") || lower.contains("tablet") || (lower.contains("android") && !lower.contains("mobile"))) {
            device = "tablet";
        } else if (lower.contains("mobi") || lower.contains("iphone") || lower.contains("android")) {
            device = "mobile";
        } else {
            device = "desktop";
        }
        return new Agent(browser, bv, os, ov, device);
    }

    private static String version(String ua, int from) {
        int end = from;
        while (end < ua.length() && (Character.isDigit(ua.charAt(end)) || ua.charAt(end) == '.')) {
            end++;
        }
        String v = ua.substring(from, end);
        int dot = v.indexOf('.');
        return dot > 0 ? v.substring(0, dot) : v;
    }
}
