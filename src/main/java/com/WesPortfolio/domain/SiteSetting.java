package com.WesPortfolio.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One editable website setting (hero text, links, which sections are visible, ...).
 * Only keys that were changed in the admin are stored; everything else uses the defaults in SiteService.
 */
@Entity
@Table(name = "site_setting")
@Getter
@Setter
@NoArgsConstructor
public class SiteSetting {

    @Id
    @Column(name = "setting_key", length = 80)
    private String key;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public SiteSetting(String key, String value) {
        this.key = key;
        this.value = value;
    }

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
