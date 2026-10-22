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
 * An AI Lab entry: experiment, benchmark, research note, infrastructure test or prototype.
 * env lines are "label TAB value"; rows lines are "label TAB value TAB pct".
 */
@Entity
@Table(name = "lab_entry")
@Getter
@Setter
@NoArgsConstructor
public class LabEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(length = 40)
    private String type;

    @Column(length = 40)
    private String color;

    /** ISO date, e.g. 2026-08-14. */
    @Column(name = "entry_date", length = 20)
    private String date;

    @Column(length = 40)
    private String status;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(columnDefinition = "TEXT")
    private String method;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> env = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String experiment;

    @Column(length = 40)
    private String unit;

    @Convert(converter = StringListConverter.class)
    @Column(name = "result_rows", columnDefinition = "TEXT")
    private List<String> rows = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String analysis;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    @Column(columnDefinition = "TEXT")
    private String code;

    private int sortOrder;

    private boolean published = true;

    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
