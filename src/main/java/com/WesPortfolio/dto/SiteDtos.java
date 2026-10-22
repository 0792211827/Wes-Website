package com.WesPortfolio.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Editable website settings and uploaded files (profile photo, CV).
 */
public final class SiteDtos {

    private SiteDtos() {
    }

    /** url is relative to the site, e.g. /api/files/photo?v=1729600000 */
    public record FileInfo(String key, String filename, String contentType, long size, Instant updatedAt, String url) {
    }

    public record SiteResponse(Map<String, String> settings, FileInfo photo, FileInfo cv) {
    }
}
