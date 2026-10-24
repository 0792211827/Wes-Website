package com.WesPortfolio.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.dto.ApiDtos.AskLogDto;
import com.WesPortfolio.dto.ApiDtos.LeadDto;
import com.WesPortfolio.dto.ApiDtos.LeadUpdateRequest;
import com.WesPortfolio.dto.ApiDtos.StatsResponse;
import com.WesPortfolio.dto.ContentDtos.KnowledgeDto;
import com.WesPortfolio.dto.ContentDtos.LabDto;
import com.WesPortfolio.dto.ContentDtos.PostDto;
import com.WesPortfolio.dto.ContentDtos.ProjectDto;
import com.WesPortfolio.repository.LabEntryRepository;
import com.WesPortfolio.repository.PostRepository;
import com.WesPortfolio.repository.ProjectRepository;
import com.WesPortfolio.service.AskService;
import com.WesPortfolio.service.ContactService;
import com.WesPortfolio.service.ContentService;

import jakarta.validation.Valid;

/**
 * Admin dashboard API: leads, Ask-AI monitoring and content editing.
 * Everything here requires the admin token (see SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ContactService contact;
    private final AskService ask;
    private final ContentService content;
    private final ProjectRepository projects;
    private final LabEntryRepository lab;
    private final PostRepository posts;

    public AdminController(ContactService contact, AskService ask, ContentService content,
            ProjectRepository projects, LabEntryRepository lab, PostRepository posts) {
        this.contact = contact;
        this.ask = ask;
        this.content = content;
        this.projects = projects;
        this.lab = lab;
        this.posts = posts;
    }

    @GetMapping("/stats")
    public StatsResponse stats() {
        return new StatsResponse(contact.count(), contact.countNew(), ask.questionCount(), ask.fallbackRate(),
                projects.count(), lab.count(), posts.count());
    }

    /* ------------------------------ leads ------------------------------ */

    @GetMapping("/leads")
    public List<LeadDto> leads() {
        return contact.all();
    }

    @PatchMapping("/leads/{id}")
    public LeadDto updateLead(@PathVariable Long id, @Valid @RequestBody LeadUpdateRequest body) {
        return contact.update(id, body);
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        contact.delete(id);
        return ResponseEntity.noContent().build();
    }

    /* ------------------------------ ask ai ------------------------------ */

    @GetMapping("/ask-logs")
    public List<AskLogDto> askLogs() {
        return ask.recentLogs();
    }

    /* ------------------------------ content ------------------------------ */

    @PutMapping("/projects")
    public ProjectDto saveProject(@Valid @RequestBody ProjectDto body) {
        ProjectDto saved = content.saveProject(body);
        ask.invalidate();
        return saved;
    }

    @DeleteMapping("/projects/{slug}")
    public ResponseEntity<Void> deleteProject(@PathVariable String slug) {
        content.deleteProject(slug);
        ask.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/lab")
    public LabDto saveLab(@Valid @RequestBody LabDto body) {
        LabDto saved = content.saveLabEntry(body);
        ask.invalidate();
        return saved;
    }

    @DeleteMapping("/lab/{slug}")
    public ResponseEntity<Void> deleteLab(@PathVariable String slug) {
        content.deleteLabEntry(slug);
        ask.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/posts")
    public PostDto savePost(@Valid @RequestBody PostDto body) {
        PostDto saved = content.savePost(body);
        ask.invalidate();
        return saved;
    }

    @DeleteMapping("/posts/{slug}")
    public ResponseEntity<Void> deletePost(@PathVariable String slug) {
        content.deletePost(slug);
        ask.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/knowledge")
    public List<KnowledgeDto> knowledge() {
        return content.knowledge();
    }

    @PutMapping("/knowledge")
    public KnowledgeDto saveKnowledge(@Valid @RequestBody KnowledgeDto body) {
        KnowledgeDto saved = content.saveKnowledge(body);
        ask.invalidate();
        return saved;
    }

    @DeleteMapping("/knowledge/{key}")
    public ResponseEntity<Void> deleteKnowledge(@PathVariable String key) {
        content.deleteKnowledge(key);
        ask.invalidate();
        return ResponseEntity.noContent().build();
    }
}
