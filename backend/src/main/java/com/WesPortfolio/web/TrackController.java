package com.WesPortfolio.web;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.dto.AnalyticsDtos.TrackRequest;
import com.WesPortfolio.dto.AnalyticsDtos.TrackResponse;
import com.WesPortfolio.service.AnalyticsService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Receives page views and actions from the website (see the privacy page).
 */
@RestController
@RequestMapping("/api/track")
public class TrackController {

    private final AnalyticsService analytics;

    public TrackController(AnalyticsService analytics) {
        this.analytics = analytics;
    }

    @PostMapping
    public TrackResponse track(@Valid @RequestBody TrackRequest body, HttpServletRequest request) {
        return new TrackResponse(analytics.record(body, ClientIp.visitor(request), request));
    }
}
