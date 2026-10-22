package com.WesPortfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.KnowledgeEntry;

public interface KnowledgeEntryRepository extends JpaRepository<KnowledgeEntry, Long> {

    List<KnowledgeEntry> findByEnabledTrue();

    List<KnowledgeEntry> findAllByOrderByKeyAsc();

    Optional<KnowledgeEntry> findByKey(String key);
}
