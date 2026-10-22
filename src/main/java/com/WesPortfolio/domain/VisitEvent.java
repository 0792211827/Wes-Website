package com.WesPortfolio.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One thing a visitor did on the website: a page view, a CV download, a question to the AI,
 * a contact form, a click to GitHub/LinkedIn... Powers the admin "Workspace".
 *
 * A visitor is a random id kept in the browser (localStorage); a session is one visit
 * (sessionStorage). Location comes from the IP address (approximate, city level).
 */
@Entity
@Table(name = "visit_event", indexes = {
        @Index(name = "ix_visit_event_created", columnList = "created_at"),
        @Index(name = "ix_visit_event_session", columnList = "session_id"),
        @Index(name = "ix_visit_event_visitor", columnList = "visitor_id")
})
@Getter
@Setter
@NoArgsConstructor
public class VisitEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "visitor_id", length = 40)
    private String visitorId;

    @Column(name = "session_id", length = 40)
    private String sessionId;

    /** pageview, cv_download, outbound, ask, contact, theme, ... */
    @Column(name = "event_type", length = 30, nullable = false)
    private String type;

    @Column(length = 300)
    private String path;

    @Column(length = 200)
    private String title;

    @Column(length = 500)
    private String referrer;

    /** Extra detail: the link clicked, the question asked, ... */
    @Column(length = 300)
    private String label;

    /** Time spent on the page (page views only), filled in when the visitor moves on. */
    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(length = 64)
    private String ip;

    @Column(length = 80)
    private String country;

    @Column(name = "country_code", length = 4)
    private String countryCode;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String city;

    private Double latitude;

    private Double longitude;

    @Column(length = 150)
    private String isp;

    @Column(name = "user_agent", length = 400)
    private String userAgent;

    @Column(length = 40)
    private String browser;

    @Column(name = "browser_version", length = 20)
    private String browserVersion;

    @Column(length = 40)
    private String os;

    @Column(name = "os_version", length = 20)
    private String osVersion;

    /** desktop, mobile, tablet or bot */
    @Column(name = "device_type", length = 20)
    private String deviceType;

    @Column(length = 20)
    private String screen;

    @Column(length = 20)
    private String language;

    @Column(name = "client_timezone", length = 60)
    private String clientTimezone;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
