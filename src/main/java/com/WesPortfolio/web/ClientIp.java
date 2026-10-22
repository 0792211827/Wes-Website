package com.WesPortfolio.web;

import jakarta.servlet.http.HttpServletRequest;

/**
 * The caller's IP address. With server.forward-headers-strategy=framework
 * (set in application.properties) Spring already applies X-Forwarded-For safely.
 */
final class ClientIp {

    private ClientIp() {
    }

    static String of(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        return ip == null ? "unknown" : ip;
    }

    /**
     * The visitor's public IP for analytics. Requests arrive through Vercel and Render's proxies,
     * so the original address is the first entry of the forwarding headers.
     */
    static String visitor(HttpServletRequest request) {
        for (String h : new String[] {"x-vercel-forwarded-for", "x-forwarded-for", "x-real-ip"}) {
            String v = request.getHeader(h);
            if (v != null && !v.isBlank()) {
                String first = v.split(",")[0].trim();
                if (!first.isEmpty() && first.length() <= 64) {
                    return first;
                }
            }
        }
        return of(request);
    }
}
