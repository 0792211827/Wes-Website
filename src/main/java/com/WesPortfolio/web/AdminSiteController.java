package com.WesPortfolio.web;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.WesPortfolio.dto.AnalyticsDtos.SessionDetail;
import com.WesPortfolio.dto.AnalyticsDtos.SessionDto;
import com.WesPortfolio.dto.AnalyticsDtos.Summary;
import com.WesPortfolio.dto.SiteDtos.FileInfo;
import com.WesPortfolio.dto.SiteDtos.SiteResponse;
import com.WesPortfolio.service.AnalyticsService;
import com.WesPortfolio.service.FileStorageService;
import com.WesPortfolio.service.SiteService;

/**
 * Admin: website settings, photo/CV uploads and the visitor Workspace. Needs the admin token.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminSiteController {

    private final SiteService site;
    private final FileStorageService files;
    private final AnalyticsService analytics;

    public AdminSiteController(SiteService site, FileStorageService files, AnalyticsService analytics) {
        this.site = site;
        this.files = files;
        this.analytics = analytics;
    }

    /* ------------------------------ settings ------------------------------ */

    @GetMapping("/site")
    public SiteResponse site() {
        return site.site();
    }

    @PutMapping("/site")
    public SiteResponse update(@RequestBody Map<String, String> changes) {
        return site.update(changes);
    }

    @DeleteMapping("/site")
    public SiteResponse reset() {
        return site.reset();
    }

    /* ------------------------------ files ------------------------------ */

    @PostMapping(value = "/files/{key}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileInfo upload(@PathVariable String key, @RequestParam("file") MultipartFile file) {
        return files.store(key, file);
    }

    @DeleteMapping("/files/{key}")
    public ResponseEntity<Void> deleteFile(@PathVariable String key) {
        files.delete(key);
        return ResponseEntity.noContent().build();
    }

    /* ------------------------------ workspace ------------------------------ */

    @GetMapping("/analytics/summary")
    public Summary summary(@RequestParam(defaultValue = "30") int days) {
        return analytics.summary(days);
    }

    @GetMapping("/analytics/sessions")
    public List<SessionDto> sessions(@RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "200") int limit,
            @RequestParam(required = false) String q) {
        return analytics.sessions(days, limit, q);
    }

    @GetMapping("/analytics/sessions/{sessionId}")
    public SessionDetail session(@PathVariable String sessionId) {
        return analytics.session(sessionId);
    }
}
