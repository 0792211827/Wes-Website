package com.WesPortfolio.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.VisitEvent;

public interface VisitEventRepository extends JpaRepository<VisitEvent, Long> {

    List<VisitEvent> findByCreatedAtAfterOrderByCreatedAtDesc(Instant after);

    List<VisitEvent> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    List<VisitEvent> findTop500ByVisitorIdOrderByCreatedAtDesc(String visitorId);

    Optional<VisitEvent> findByIdAndSessionId(Long id, String sessionId);

    long countByCreatedAtAfter(Instant after);

    long deleteByCreatedAtBefore(Instant before);
}
