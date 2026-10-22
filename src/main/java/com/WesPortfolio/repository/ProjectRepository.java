package com.WesPortfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByPublishedTrueOrderBySortOrderAscIdAsc();

    List<Project> findAllByOrderBySortOrderAscIdAsc();

    Optional<Project> findBySlug(String slug);

    Optional<Project> findBySlugAndPublishedTrue(String slug);
}
