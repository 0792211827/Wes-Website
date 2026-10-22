package com.WesPortfolio.dto;

import java.time.Instant;
import java.util.List;

import com.WesPortfolio.domain.LeadStatus;
import com.WesPortfolio.dto.ContentDtos.SourceLink;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Request and response bodies for contact, Ask-AI, login and the admin dashboard.
 */
public final class ApiDtos {

    private ApiDtos() {
    }

    /* ----------------------------- contact ----------------------------- */

    public record ContactRequest(
            @NotBlank(message = "Please enter your name.") @Size(min = 2, max = 120, message = "Name must be 2 to 120 characters.") String name,
            @NotBlank(message = "Please enter your email address.") @Email(message = "Please enter a valid email address.") @Size(max = 160) String email,
            @Size(max = 120, message = "Company must be at most 120 characters.") String company,
            @Size(max = 120, message = "Role must be at most 120 characters.") String role,
            @NotEmpty(message = "Choose at least one option.") @Size(max = 9, message = "Choose at most 9 options.") List<@NotBlank @Size(max = 40) String> services,
            @NotBlank(message = "Please describe the problem.") @Size(min = 30, max = 4000, message = "A little more detail helps: 30 to 4000 characters.") String problem,
            @Size(max = 60) String budget,
            @Size(max = 60) String timeline,
            /** Honeypot: real visitors never see or fill this field. */
            String website) {
    }

    public record ContactResponse(Long id, String message) {
    }

    /* ----------------------------- ask ai ----------------------------- */

    public record AskRequest(
            @NotBlank(message = "Please type a question.") @Size(max = 500, message = "Questions can be at most 500 characters.") String question,
            @Size(max = 80) String sessionId) {
    }

    public record AskResponse(
            String answer,
            List<SourceLink> sources,
            boolean grounded,
            boolean fallback,
            String mode,
            String trace,
            int remaining) {
    }

    /* ----------------------------- auth ----------------------------- */

    public record LoginRequest(
            @NotBlank @Size(max = 120) String username,
            @NotBlank @Size(max = 200) String password) {
    }

    public record LoginResponse(String token, Instant expiresAt) {
    }

    /* ----------------------------- admin ----------------------------- */

    public record LeadDto(
            Long id,
            String name,
            String email,
            String company,
            String role,
            List<String> services,
            String problem,
            String budget,
            String timeline,
            LeadStatus status,
            String notes,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record LeadUpdateRequest(LeadStatus status, @Size(max = 4000) String notes) {
    }

    public record AskLogDto(
            Long id,
            String question,
            String mode,
            String topKey,
            double score,
            boolean fallback,
            long latencyMs,
            Instant createdAt) {
    }

    public record StatsResponse(
            long leads,
            long newLeads,
            long questions,
            double fallbackRate,
            long projects,
            long labEntries,
            long posts) {
    }
}
