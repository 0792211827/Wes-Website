package com.WesPortfolio.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.WesPortfolio.domain.KnowledgeEntry;
import com.WesPortfolio.domain.LabEntry;
import com.WesPortfolio.domain.Post;
import com.WesPortfolio.domain.Project;
import com.WesPortfolio.dto.ContentDtos.KnowledgeDto;
import com.WesPortfolio.dto.ContentDtos.LabDto;
import com.WesPortfolio.dto.ContentDtos.PostDto;
import com.WesPortfolio.dto.ContentDtos.ProjectDto;
import com.WesPortfolio.repository.KnowledgeEntryRepository;
import com.WesPortfolio.repository.LabEntryRepository;
import com.WesPortfolio.repository.PostRepository;
import com.WesPortfolio.repository.ProjectRepository;
import com.WesPortfolio.service.ContentMapper;

/**
 * Fills each content table with the starter content from {@link SeedData}
 * the first time the API starts. Tables that already have rows are never touched,
 * so edits made through the admin API are kept across restarts and deploys.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    /** The original developer's sample case studies, replaced by Wesley's real projects on 2026-10-25. */
    private static final Set<String> RETIRED_PROJECTS = Set.of(
            "enterprise-knowledge-assistant", "contract-intelligence-pipeline", "voice-agent-customer-support",
            "private-llm-inference-platform", "agentic-operations-copilot");

    /** Ask-AI answers that pointed at the retired case studies. */
    private static final List<String> REWRITTEN_KNOWLEDGE = List.of("rag", "infra", "voice", "agents", "portfolio", "stack");

    /**
     * Unsourced claims in the original Ask-AI answers (removed 2026-10-26), keyed by entry. An entry whose
     * answer still contains its phrase is replaced with the seeded answer; an answer rewritten in /admin is kept.
     */
    private static final Map<String, String> STALE_KNOWLEDGE = Map.of(
            "what-build", "production AI systems in six areas",
            "evaluate", "two to three weeks",
            "engage", "seven steps",
            "contact", "two working days",
            "about", "AI engineer and consultant",
            "voice", "Wesley builds real-time voice agents",
            "stack", "embedding models and vector search",
            "portfolio", "decisions and tradeoffs");

    /** The "training" entry described workshops that were never sourced; deleted while it still says so. */
    private static final String STALE_TRAINING = "runs practical workshops";

    private final ProjectRepository projects;
    private final LabEntryRepository lab;
    private final PostRepository posts;
    private final KnowledgeEntryRepository knowledge;

    public DataSeeder(ProjectRepository projects, LabEntryRepository lab, PostRepository posts,
            KnowledgeEntryRepository knowledge) {
        this.projects = projects;
        this.lab = lab;
        this.posts = posts;
        this.knowledge = knowledge;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (projects.count() == 0) {
            for (ProjectDto dto : SeedData.projects()) {
                Project p = new Project();
                ContentMapper.apply(dto, p);
                projects.save(p);
            }
            log.info("Seeded {} case studies", projects.count());
        }
        retireSampleProjects();
        backfillProjectBodies();
        if (lab.count() == 0) {
            for (LabDto dto : SeedData.lab()) {
                LabEntry l = new LabEntry();
                ContentMapper.apply(dto, l);
                lab.save(l);
            }
            log.info("Seeded {} AI Lab entries", lab.count());
        }
        if (posts.count() == 0) {
            for (PostDto dto : SeedData.posts()) {
                Post p = new Post();
                ContentMapper.apply(dto, p);
                posts.save(p);
            }
            log.info("Seeded {} articles", posts.count());
        }
        if (knowledge.count() == 0) {
            for (KnowledgeDto dto : SeedData.knowledge()) {
                KnowledgeEntry k = new KnowledgeEntry();
                ContentMapper.apply(dto, k);
                knowledge.save(k);
            }
            log.info("Seeded {} knowledge-base answers", knowledge.count());
        }
        refreshStaleKnowledge();
    }

    /**
     * Brings databases seeded before 2026-10-26 in line with the sourced Ask-AI answers: replaces answers that
     * still carry an unsourced claim, deletes the unsourced "training" entry and points "/contact" sources at
     * the home page contact section. Idempotent: does nothing once the old text is gone.
     */
    private void refreshStaleKnowledge() {
        int changed = 0;
        for (KnowledgeDto dto : SeedData.knowledge()) {
            String phrase = STALE_KNOWLEDGE.get(dto.key());
            if (phrase == null) {
                continue;
            }
            var stale = knowledge.findByKey(dto.key()).filter((k) -> k.getAnswer() != null && k.getAnswer().contains(phrase));
            if (stale.isPresent()) {
                ContentMapper.apply(dto, stale.get());
                knowledge.save(stale.get());
                changed++;
            }
        }
        var training = knowledge.findByKey("training").filter((k) -> k.getAnswer() != null && k.getAnswer().contains(STALE_TRAINING));
        if (training.isPresent()) {
            knowledge.delete(training.get());
            changed++;
        }
        for (KnowledgeEntry k : knowledge.findAll()) {
            if (k.getSources() == null || k.getSources().stream().noneMatch((line) -> line.endsWith("\t/contact"))) {
                continue;
            }
            List<String> fixed = new ArrayList<>();
            for (String line : k.getSources()) {
                fixed.add(line.endsWith("\t/contact") ? line.substring(0, line.length() - "/contact".length()) + "/#contact" : line);
            }
            k.setSources(fixed);
            knowledge.save(k);
            changed++;
        }
        if (changed > 0) {
            log.info("Refreshed {} Ask-AI knowledge entries with sourced answers", changed);
        }
    }

    /**
     * One-time swap for databases seeded before the real case studies existed: removes the sample
     * case studies, adds the real ones and refreshes the Ask-AI answers that linked to the samples.
     * Does nothing once no sample case study is left, so later admin edits are kept.
     */
    private void retireSampleProjects() {
        List<Project> retired = projects.findAll().stream().filter((p) -> RETIRED_PROJECTS.contains(p.getSlug())).toList();
        if (retired.isEmpty()) {
            return;
        }
        projects.deleteAll(retired);
        projects.flush();
        for (ProjectDto dto : SeedData.projects()) {
            if (projects.findBySlug(dto.slug()).isEmpty()) {
                Project p = new Project();
                ContentMapper.apply(dto, p);
                projects.save(p);
            }
        }
        for (KnowledgeDto dto : SeedData.knowledge()) {
            if (REWRITTEN_KNOWLEDGE.contains(dto.key())) {
                KnowledgeEntry k = knowledge.findByKey(dto.key()).orElseGet(KnowledgeEntry::new);
                ContentMapper.apply(dto, k);
                knowledge.save(k);
            }
        }
        log.info("Replaced {} sample case studies with the real ones", retired.size());
    }

    /** Case studies created before the long-form write-up existed get the seeded body; edited bodies are kept. */
    private void backfillProjectBodies() {
        for (ProjectDto dto : SeedData.projects()) {
            projects.findBySlug(dto.slug())
                    .filter((p) -> (p.getBody() == null || p.getBody().isBlank()) && dto.body() != null && !dto.body().isBlank())
                    .ifPresent((p) -> {
                        p.setBody(dto.body());
                        projects.save(p);
                        log.info("Added the technical write-up to {}", dto.slug());
                    });
        }
    }
}
