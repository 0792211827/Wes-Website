package com.WesPortfolio.web;

import java.time.Duration;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.service.GithubService;

/**
 * Wesley's public GitHub data, cached on the server (username from app.github.username).
 */
@RestController
@RequestMapping("/api/github")
public class GithubController {

    private static final CacheControl CACHE = CacheControl.maxAge(Duration.ofMinutes(15)).cachePublic();

    private final GithubService github;

    public GithubController(GithubService github) {
        this.github = github;
    }

    @GetMapping(value = "/repos", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> repos() {
        return ResponseEntity.ok().cacheControl(CACHE).contentType(MediaType.APPLICATION_JSON).body(github.repositories());
    }

    @GetMapping(value = "/contributions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> contributions() {
        return ResponseEntity.ok().cacheControl(CACHE).contentType(MediaType.APPLICATION_JSON).body(github.contributions());
    }
}
