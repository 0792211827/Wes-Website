package com.WesPortfolio.service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.WesPortfolio.domain.KnowledgeEntry;
import com.WesPortfolio.domain.LabEntry;
import com.WesPortfolio.domain.Post;
import com.WesPortfolio.domain.Project;
import com.WesPortfolio.dto.ContentDtos.Decision;
import com.WesPortfolio.dto.ContentDtos.KnowledgeDto;
import com.WesPortfolio.dto.ContentDtos.LabDto;
import com.WesPortfolio.dto.ContentDtos.LabRow;
import com.WesPortfolio.dto.ContentDtos.Pair;
import com.WesPortfolio.dto.ContentDtos.PostDto;
import com.WesPortfolio.dto.ContentDtos.ProjectDto;
import com.WesPortfolio.dto.ContentDtos.SourceLink;

/**
 * Converts between database entities and the JSON records the website uses.
 * Structured list items are stored as tab-separated lines.
 */
public final class ContentMapper {

    private static final String TAB = "\t";

    private ContentMapper() {
    }

    /* ------------------------------ projects ------------------------------ */

    public static ProjectDto toDto(Project p) {
        return new ProjectDto(
                p.getSlug(), p.getTitle(), p.getCategory(), p.getCat(), p.getArt(), p.getYear(),
                p.getProblem(), p.getOutcome(),
                new Pair(nz(p.getMetricLabel()), nz(p.getMetricValue())),
                copy(p.getTech()), p.getOverview(), p.getContext(),
                copy(p.getRequirements()), copy(p.getArch()), p.getImplementation(), copy(p.getChallenges()),
                map(p.getDecisions(), ContentMapper::decision),
                p.getEvaluation(),
                map(p.getResults(), ContentMapper::pair),
                copy(p.getLessons()), copy(p.getResources()),
                p.isFeatured(), p.getSortOrder());
    }

    public static void apply(ProjectDto d, Project p) {
        p.setSlug(d.slug().trim());
        p.setTitle(d.title().trim());
        p.setCategory(d.category());
        p.setCat(d.cat());
        p.setArt(d.art());
        p.setYear(d.year());
        p.setProblem(d.problem());
        p.setOutcome(d.outcome());
        p.setMetricLabel(d.metric() == null ? null : d.metric().label());
        p.setMetricValue(d.metric() == null ? null : d.metric().value());
        p.setTech(clean(d.tech()));
        p.setOverview(d.overview());
        p.setContext(d.context());
        p.setRequirements(clean(d.requirements()));
        p.setArch(clean(d.arch()));
        p.setImplementation(d.implementation());
        p.setChallenges(clean(d.challenges()));
        p.setDecisions(map(d.decisions(), x -> join(x.title(), x.body(), x.tradeoff())));
        p.setEvaluation(d.evaluation());
        p.setResults(map(d.results(), x -> join(x.label(), x.value())));
        p.setLessons(clean(d.lessons()));
        p.setResources(clean(d.resources()));
        p.setFeatured(d.featured());
        p.setSortOrder(d.sortOrder());
    }

    /* ------------------------------ lab ------------------------------ */

    public static LabDto toDto(LabEntry l) {
        return new LabDto(
                l.getSlug(), l.getType(), l.getColor(), l.getDate(), l.getStatus(), l.getTitle(),
                l.getQuestion(), l.getMethod(),
                map(l.getEnv(), ContentMapper::pair),
                l.getExperiment(), l.getUnit(),
                map(l.getRows(), ContentMapper::row),
                l.getAnalysis(), l.getConclusion(), l.getCode(), l.getSortOrder());
    }

    public static void apply(LabDto d, LabEntry l) {
        l.setSlug(d.slug().trim());
        l.setType(d.type());
        l.setColor(d.color());
        l.setDate(d.date());
        l.setStatus(d.status());
        l.setTitle(d.title().trim());
        l.setQuestion(d.question());
        l.setMethod(d.method());
        l.setEnv(map(d.env(), x -> join(x.label(), x.value())));
        l.setExperiment(d.experiment());
        l.setUnit(d.unit());
        l.setRows(map(d.rows(), x -> join(x.label(), String.valueOf(x.value()), String.valueOf(x.pct()))));
        l.setAnalysis(d.analysis());
        l.setConclusion(d.conclusion());
        l.setCode(d.code());
        l.setSortOrder(d.sortOrder());
    }

    /* ------------------------------ posts ------------------------------ */

    public static PostDto toDto(Post p) {
        return new PostDto(p.getSlug(), p.getTrack(), p.getDate(), p.getReadMinutes(), p.getTitle(),
                copy(p.getTags()), p.getExcerpt(), p.getBody());
    }

    public static void apply(PostDto d, Post p) {
        p.setSlug(d.slug().trim());
        p.setTrack(d.track());
        p.setDate(d.date());
        p.setReadMinutes(d.readMinutes() > 0 ? d.readMinutes() : estimateMinutes(d.body()));
        p.setTitle(d.title().trim());
        p.setTags(clean(d.tags()));
        p.setExcerpt(d.excerpt());
        p.setBody(d.body());
    }

    /* ------------------------------ knowledge ------------------------------ */

    public static KnowledgeDto toDto(KnowledgeEntry k) {
        return new KnowledgeDto(k.getKey(), k.getTitle(), k.getKeywords(), k.getAnswer(),
                map(k.getSources(), ContentMapper::source));
    }

    public static void apply(KnowledgeDto d, KnowledgeEntry k) {
        k.setKey(d.key().trim());
        k.setTitle(d.title().trim());
        k.setKeywords(d.keywords());
        k.setAnswer(d.answer());
        k.setSources(map(d.sources(), x -> join(x.label(), x.url())));
    }

    public static List<SourceLink> sources(KnowledgeEntry k) {
        return map(k.getSources(), ContentMapper::source);
    }

    /* ------------------------------ helpers ------------------------------ */

    static int estimateMinutes(String body) {
        if (body == null || body.isBlank()) {
            return 1;
        }
        int words = body.trim().split("\\s+").length;
        return Math.max(1, Math.round(words / 220f));
    }

    private static Pair pair(String line) {
        String[] p = parts(line, 2);
        return new Pair(p[0], p[1]);
    }

    private static SourceLink source(String line) {
        String[] p = parts(line, 2);
        return new SourceLink(p[0], p[1]);
    }

    private static Decision decision(String line) {
        String[] p = parts(line, 3);
        return new Decision(p[0], p[1], p[2]);
    }

    private static LabRow row(String line) {
        String[] p = parts(line, 3);
        double value;
        int pct;
        try {
            value = Double.parseDouble(p[1]);
        } catch (NumberFormatException e) {
            value = 0;
        }
        try {
            pct = (int) Math.round(Double.parseDouble(p[2]));
        } catch (NumberFormatException e) {
            pct = 0;
        }
        return new LabRow(p[0], value, pct);
    }

    private static String[] parts(String line, int n) {
        String[] raw = (line == null ? "" : line).split(TAB, n);
        String[] out = new String[n];
        for (int i = 0; i < n; i++) {
            out[i] = i < raw.length ? raw[i] : "";
        }
        return out;
    }

    private static String join(String... values) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            if (i > 0) {
                sb.append(TAB);
            }
            sb.append(flat(values[i]));
        }
        return sb.toString();
    }

    /** Tabs and line breaks are separators in storage, so they become spaces inside values. */
    private static String flat(String s) {
        return s == null ? "" : s.replace('\t', ' ').replace('\r', ' ').replace('\n', ' ').trim();
    }

    private static List<String> clean(List<String> items) {
        List<String> out = new ArrayList<>();
        if (items != null) {
            for (String s : items) {
                String f = flat(s);
                if (!f.isEmpty()) {
                    out.add(f);
                }
            }
        }
        return out;
    }

    private static List<String> copy(List<String> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private static <A, B> List<B> map(List<A> items, Function<A, B> f) {
        List<B> out = new ArrayList<>();
        if (items != null) {
            for (A a : items) {
                if (a != null) {
                    out.add(f.apply(a));
                }
            }
        }
        return out;
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }
}
