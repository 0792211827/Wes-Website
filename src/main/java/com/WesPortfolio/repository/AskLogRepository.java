package com.WesPortfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.AskLog;

public interface AskLogRepository extends JpaRepository<AskLog, Long> {

    List<AskLog> findTop200ByOrderByCreatedAtDesc();

    long countByFallbackTrue();
}
