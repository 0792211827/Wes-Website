package com.WesPortfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.Lead;
import com.WesPortfolio.domain.LeadStatus;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findAllByOrderByCreatedAtDesc();

    long countByStatus(LeadStatus status);
}
