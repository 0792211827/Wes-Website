package com.WesPortfolio.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One question asked to "Ask Wesley's AI", kept so answers can be monitored and improved.
 * No personal data: the visitor IP is stored only as a salted hash.
 */
@Entity
@Table(name = "ask_log")
@Getter
@Setter
@NoArgsConstructor
public class AskLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String question;

    /** llm, extractive, refusal or fallback. */
    @Column(length = 20)
    private String mode;

    /** Key of the best-matching document, e.g. "rag" or "project:enterprise-knowledge-assistant". */
    @Column(length = 160)
    private String topKey;

    private double score;

    private boolean fallback;

    private long latencyMs;

    @Column(length = 64)
    private String ipHash;

    @Column(length = 80)
    private String sessionId;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void created() {
        createdAt = Instant.now();
    }
}
