package com.WesPortfolio.web;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.dto.ContentDtos.LabDto;
import com.WesPortfolio.dto.ContentDtos.PostDto;
import com.WesPortfolio.dto.ContentDtos.ProjectDto;
import com.WesPortfolio.service.ContentService;

/**
 * Read-only content for the public website: case studies, AI Lab and articles.
 */
@RestController
@RequestMapping("/api")
public class PublicContentController {

    private static final CacheControl SHORT_CACHE = CacheControl.maxAge(Duration.ofSeconds(60)).cachePublic();

    private final ContentService content;

    public PublicContentController(ContentService content) {
        this.content = content;
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> projects() {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.projects());
    }

    @GetMapping("/projects/{slug}")
    public ResponseEntity<ProjectDto> project(@PathVariable String slug) {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.project(slug));
    }

    @GetMapping("/lab")
    public ResponseEntity<List<LabDto>> lab() {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.labEntries());
    }

    @GetMapping("/lab/{slug}")
    public ResponseEntity<LabDto> labEntry(@PathVariable String slug) {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.labEntry(slug));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostDto>> posts() {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.posts());
    }

    @GetMapping("/posts/{slug}")
    public ResponseEntity<PostDto> post(@PathVariable String slug) {
        return ResponseEntity.ok().cacheControl(SHORT_CACHE).body(content.post(slug));
    }

    /** Simple uptime check for Render and for the site footer status dot. */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "time", Instant.now().toString());
    }
}
