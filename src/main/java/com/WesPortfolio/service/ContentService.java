package com.WesPortfolio.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

/**
 * Reads published content for the website and lets the admin create, update and delete it.
 */
@Service
public class ContentService {

    private final ProjectRepository projects;
    private final LabEntryRepository lab;
    private final PostRepository posts;
    private final KnowledgeEntryRepository knowledge;

    public ContentService(ProjectRepository projects, LabEntryRepository lab, PostRepository posts,
            KnowledgeEntryRepository knowledge) {
        this.projects = projects;
        this.lab = lab;
        this.posts = posts;
        this.knowledge = knowledge;
    }

    /* ------------------------------ public reads ------------------------------ */

    @Transactional(readOnly = true)
    public List<ProjectDto> projects() {
        return projects.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(ContentMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto project(String slug) {
        return projects.findBySlugAndPublishedTrue(slug).map(ContentMapper::toDto)
                .orElseThrow(() -> notFound("Case study"));
    }

    @Transactional(readOnly = true)
    public List<LabDto> labEntries() {
        return lab.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(ContentMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public LabDto labEntry(String slug) {
        return lab.findBySlugAndPublishedTrue(slug).map(ContentMapper::toDto)
                .orElseThrow(() -> notFound("Lab entry"));
    }

    @Transactional(readOnly = true)
    public List<PostDto> posts() {
        return posts.findByPublishedTrueOrderByDateDescIdDesc().stream().map(ContentMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public PostDto post(String slug) {
        return posts.findBySlugAndPublishedTrue(slug).map(ContentMapper::toDto)
                .orElseThrow(() -> notFound("Article"));
    }

    @Transactional(readOnly = true)
    public List<KnowledgeDto> knowledge() {
        return knowledge.findAllByOrderByKeyAsc().stream().map(ContentMapper::toDto).toList();
    }

    /* ------------------------------ admin writes ------------------------------ */

    @Transactional
    public ProjectDto saveProject(ProjectDto dto) {
        Project p = projects.findBySlug(dto.slug().trim()).orElseGet(Project::new);
        ContentMapper.apply(dto, p);
        return ContentMapper.toDto(projects.save(p));
    }

    @Transactional
    public void deleteProject(String slug) {
        projects.delete(projects.findBySlug(slug).orElseThrow(() -> notFound("Case study")));
    }

    @Transactional
    public LabDto saveLabEntry(LabDto dto) {
        LabEntry l = lab.findBySlug(dto.slug().trim()).orElseGet(LabEntry::new);
        ContentMapper.apply(dto, l);
        return ContentMapper.toDto(lab.save(l));
    }

    @Transactional
    public void deleteLabEntry(String slug) {
        lab.delete(lab.findBySlug(slug).orElseThrow(() -> notFound("Lab entry")));
    }

    @Transactional
    public PostDto savePost(PostDto dto) {
        Post p = posts.findBySlug(dto.slug().trim()).orElseGet(Post::new);
        ContentMapper.apply(dto, p);
        return ContentMapper.toDto(posts.save(p));
    }

    @Transactional
    public void deletePost(String slug) {
        posts.delete(posts.findBySlug(slug).orElseThrow(() -> notFound("Article")));
    }

    @Transactional
    public KnowledgeDto saveKnowledge(KnowledgeDto dto) {
        KnowledgeEntry k = knowledge.findByKey(dto.key().trim()).orElseGet(KnowledgeEntry::new);
        ContentMapper.apply(dto, k);
        return ContentMapper.toDto(knowledge.save(k));
    }

    @Transactional
    public void deleteKnowledge(String key) {
        knowledge.delete(knowledge.findByKey(key).orElseThrow(() -> notFound("Knowledge entry")));
    }

    private static ResponseStatusException notFound(String what) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, what + " not found");
    }
}
