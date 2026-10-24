package com.WesPortfolio.config;

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
    }
}
