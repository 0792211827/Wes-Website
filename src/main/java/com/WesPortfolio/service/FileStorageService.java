package com.WesPortfolio.service;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.domain.StoredFile;
import com.WesPortfolio.dto.SiteDtos.FileInfo;
import com.WesPortfolio.repository.StoredFileRepository;

/**
 * Profile photo and CV uploads, kept in PostgreSQL (Render's own disk is wiped on every deploy).
 */
@Service
public class FileStorageService {

    private record Rule(Set<String> types, long maxBytes, String label) {
    }

    private static final Map<String, Rule> RULES = Map.of(
            "photo", new Rule(Set.of("image/jpeg", "image/png", "image/webp"), 5L * 1024 * 1024, "a JPG, PNG or WebP image up to 5 MB"),
            "cv", new Rule(Set.of("application/pdf"), 10L * 1024 * 1024, "a PDF up to 10 MB"));

    private final StoredFileRepository repo;

    public FileStorageService(StoredFileRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public FileInfo store(String key, MultipartFile file) {
        Rule rule = RULES.get(key);
        if (rule == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown file slot: " + key);
        }
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a file to upload");
        }
        String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!rule.types().contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please upload " + rule.label());
        }
        if (file.getSize() > rule.maxBytes()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please upload " + rule.label());
        }
        try {
            byte[] bytes = file.getBytes();
            if (!looksLike(type, bytes)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That file does not look like " + rule.label());
            }
            StoredFile f = repo.findById(key).orElseGet(StoredFile::new);
            f.setKey(key);
            f.setFilename(safeName(file.getOriginalFilename(), key));
            f.setContentType(type);
            f.setSize(bytes.length);
            f.setData(bytes);
            repo.save(f);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read the uploaded file");
        }
        return info(key);
    }

    @Transactional(readOnly = true)
    public Optional<StoredFile> load(String key) {
        return repo.findById(key);
    }

    @Transactional(readOnly = true)
    public FileInfo info(String key) {
        return repo.findInfo(key)
                .map(i -> new FileInfo(i.getKey(), i.getFilename(), i.getContentType(), i.getSize(), i.getUpdatedAt(),
                        "/api/files/" + i.getKey() + "?v=" + (i.getUpdatedAt() == null ? 0 : i.getUpdatedAt().getEpochSecond())))
                .orElse(null);
    }

    @Transactional
    public void delete(String key) {
        if (repo.existsById(key)) {
            repo.deleteById(key);
        }
    }

    /** Checks the first bytes, so a renamed file cannot pretend to be an image or PDF. */
    private static boolean looksLike(String type, byte[] b) {
        if (b.length < 4) {
            return false;
        }
        return switch (type) {
            case "application/pdf" -> b[0] == '%' && b[1] == 'P' && b[2] == 'D' && b[3] == 'F';
            case "image/png" -> (b[0] & 0xff) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G';
            case "image/jpeg" -> (b[0] & 0xff) == 0xFF && (b[1] & 0xff) == 0xD8;
            case "image/webp" -> b.length > 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                    && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
            default -> false;
        };
    }

    private static String safeName(String original, String key) {
        String n = original == null ? key : original.replaceAll("[^A-Za-z0-9._ -]", "_").trim();
        if (n.isEmpty()) {
            n = key;
        }
        return n.length() > 150 ? n.substring(n.length() - 150) : n;
    }
}
