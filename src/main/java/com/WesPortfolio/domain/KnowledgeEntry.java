package com.WesPortfolio.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One approved answer in the curated knowledge base behind "Ask Wesley's AI".
 * Only public, professional information belongs here.
 * sources lines are "label TAB url".
 */
@Entity
@Table(name = "knowledge_entry")
@Getter
@Setter
@NoArgsConstructor
public class KnowledgeEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_key", nullable = false, unique = true, length = 80)
    private String key;

    @Column(nullable = false, length = 200)
    private String title;

    /** Space-separated words that should match this entry. */
    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> sources = new ArrayList<>();

    private boolean enabled = true;

    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
