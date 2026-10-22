package com.WesPortfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.LabEntry;

public interface LabEntryRepository extends JpaRepository<LabEntry, Long> {

    List<LabEntry> findByPublishedTrueOrderBySortOrderAscIdAsc();

    Optional<LabEntry> findBySlug(String slug);

    Optional<LabEntry> findBySlugAndPublishedTrue(String slug);
}
