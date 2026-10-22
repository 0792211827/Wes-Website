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
}
