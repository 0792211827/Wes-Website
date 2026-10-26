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
 * A case study shown on /work and /work/{slug}.
 * List fields are stored one item per line; decisions as "title TAB body TAB tradeoff",
 * results as "label TAB value".
 */
@Entity
@Table(name = "project")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 200)
    private String category;

    /** Filter key: rag, enterprise, agents, voice, infra. */
    @Column(length = 40)
    private String cat;

    /** Illustration used on the card: rag, doc, voice, infra, agent. */
    @Column(length = 40)
    private String art;

    @Column(name = "project_year", length = 10)
    private String year;

    @Column(columnDefinition = "TEXT")
    private String problem;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    @Column(length = 80)
    private String metricLabel;

    @Column(length = 40)
    private String metricValue;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> tech = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(columnDefinition = "TEXT")
    private String context;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> requirements = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> arch = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String implementation;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> challenges = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> decisions = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String evaluation;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> results = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> lessons = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> resources = new ArrayList<>();

    /** Long-form technical write-up (markdown). */
    @Column(columnDefinition = "TEXT")
    private String body;

    private boolean featured;

    private int sortOrder;

    private boolean published = true;

    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
