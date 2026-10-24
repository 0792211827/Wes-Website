package com.WesPortfolio.domain;

import java.time.Instant;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A file uploaded in the admin (profile photo, CV), stored in the database.
 * Render's disk is wiped on every deploy, so files live in PostgreSQL instead.
 */
@Entity
@Table(name = "stored_file")
@Getter
@Setter
@NoArgsConstructor
public class StoredFile {

    /** "photo" or "cv" */
    @Id
    @Column(name = "file_key", length = 40)
    private String key;

    @Column(length = 200)
    private String filename;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "size_bytes")
    private long size;

    /** bytea on PostgreSQL; the length keeps H2 (local profile) happy too. */
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "data", length = 16_000_000)
    private byte[] data;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
