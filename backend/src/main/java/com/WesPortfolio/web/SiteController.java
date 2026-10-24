package com.WesPortfolio.web;

import java.time.Duration;

import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.domain.StoredFile;
import com.WesPortfolio.dto.SiteDtos.SiteResponse;
import com.WesPortfolio.service.FileStorageService;
import com.WesPortfolio.service.SiteService;

/**
 * Public website settings, profile photo and CV download.
 */
@RestController
@RequestMapping("/api")
public class SiteController {

    private final SiteService site;
    private final FileStorageService files;

    public SiteController(SiteService site, FileStorageService files) {
        this.site = site;
        this.files = files;
    }

    @GetMapping("/site")
    public ResponseEntity<SiteResponse> site() {
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(Duration.ofSeconds(30)).cachePublic()).body(site.site());
    }

    /** /api/files/photo and /api/files/cv (the CV downloads as "Wesley-Nyamosi-CV.pdf"). */
    @GetMapping("/files/{key}")
    public ResponseEntity<byte[]> file(@PathVariable String key) {
        StoredFile f = files.load(key).orElse(null);
        if (f == null || f.getData() == null) {
            return ResponseEntity.notFound().build();
        }
        ContentDisposition disposition = "cv".equals(key)
                ? ContentDisposition.attachment().filename("Wesley-Nyamosi-CV.pdf").build()
                : ContentDisposition.inline().filename(f.getFilename() == null ? key : f.getFilename()).build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(f.getContentType()))
                .contentLength(f.getData().length)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .cacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic())
                .body(f.getData());
    }
}
