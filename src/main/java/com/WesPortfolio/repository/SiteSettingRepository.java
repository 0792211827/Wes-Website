package com.WesPortfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WesPortfolio.domain.SiteSetting;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {
}
