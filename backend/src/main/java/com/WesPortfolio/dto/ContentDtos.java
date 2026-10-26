package com.WesPortfolio.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Public JSON shapes for the site's content. The Angular app uses the same field names
 * (see docs/API_CONTRACT.md). Admin upserts accept the same records.
 */
public final class ContentDtos {

    private ContentDtos() {
    }

    /** Slugs are lowercase words joined by hyphens, e.g. local-rag-private-llm. */
    public static final String SLUG = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

    public record Pair(String label, String value) {
    }

    public record Decision(String title, String body, String tradeoff) {
    }

    public record LabRow(String label, double value, int pct) {
    }

    public record SourceLink(String label, String url) {
    }

    public record ProjectDto(
            @NotBlank @Size(max = 120) @Pattern(regexp = SLUG) String slug,
            @NotBlank @Size(max = 200) String title,
            @Size(max = 200) String category,
            @Size(max = 40) String cat,
            @Size(max = 40) String art,
            @Size(max = 10) String year,
            String problem,
            String outcome,
            Pair metric,
            List<String> tech,
            String overview,
            String context,
            List<String> requirements,
            List<String> arch,
            String implementation,
            List<String> challenges,
            List<Decision> decisions,
            String evaluation,
            List<Pair> results,
            List<String> lessons,
            List<String> resources,
            /** Long-form technical write-up (markdown). */
            String body,
            boolean featured,
            int sortOrder) {
    }

    public record LabDto(
            @NotBlank @Size(max = 120) @Pattern(regexp = SLUG) String slug,
            @Size(max = 40) String type,
            @Size(max = 40) String color,
            @Size(max = 20) String date,
            @Size(max = 40) String status,
            @NotBlank @Size(max = 200) String title,
            String question,
            String method,
            List<Pair> env,
            String experiment,
            @Size(max = 40) String unit,
            List<LabRow> rows,
            String analysis,
            String conclusion,
            String code,
            int sortOrder) {
    }

    public record PostDto(
            @NotBlank @Size(max = 120) @Pattern(regexp = SLUG) String slug,
            @Size(max = 40) String track,
            @Size(max = 20) String date,
            int readMinutes,
            @NotBlank @Size(max = 200) String title,
            List<String> tags,
            String excerpt,
            String body) {
    }

    public record KnowledgeDto(
            @NotBlank @Size(max = 80) String key,
            @NotBlank @Size(max = 200) String title,
            String keywords,
            @NotBlank String answer,
            List<SourceLink> sources) {
    }
}
