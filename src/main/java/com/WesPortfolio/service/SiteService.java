package com.WesPortfolio.service;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.domain.SiteSetting;
import com.WesPortfolio.dto.SiteDtos.SiteResponse;
import com.WesPortfolio.repository.SiteSettingRepository;

/**
 * Website texts, links and section visibility that Wesley edits in the admin.
 * The defaults below are what the site shows until something is changed.
 */
@Service
public class SiteService {

    /** Every editable key with its default value (lists are one item per line). */
    public static final Map<String, String> DEFAULTS;

    static {
        Map<String, String> d = new LinkedHashMap<>();
        // hero
        d.put("name", "Wesley Nyamosi");
        d.put("role", "AI Engineering & Consulting");
        d.put("headline", "Building AI systems that [[work beyond the demo.]]");
        d.put("support", "I design and build production-ready AI systems and applications that solve real business problems, "
                + "from strategy and architecture to evaluation, deployment and the infrastructure underneath.");
        d.put("availability", "open to engagements");
        d.put("showStamp", "true");
        d.put("building", String.join("\n",
                "an evaluation harness for multi-turn RAG assistants",
                "a self-hosted inference stack for open-weight models",
                "a sub-second voice agent pipeline",
                "agent tool-use guardrails with human approval steps"));
        d.put("heroTags", String.join("\n",
                "AI Architecture|c-green", "Enterprise AI|c-amber", "RAG & Agents|c-sky", "LLM Evaluation|c-rose",
                "Voice AI|c-violet", "Open-Weight LLMs|c-teal", "vLLM|c-orange", "Python|c-cream",
                "Kubernetes|c-sky", "PostgreSQL|c-green"));
        d.put("tldr", String.join("\n",
                "AI engineer & consultant", "RAG, agents, voice & open-weight LLMs",
                "evaluation before opinions", "open to consulting engagements"));
        d.put("now", String.join("\n",
                "building: an evaluation harness for multi-turn RAG assistants", "writing: Evaluating LLM applications",
                "testing: prefix caching on vLLM", "updated monthly"));
        // contact & links
        d.put("email", "hello@wesleynyamosi.com");
        d.put("phone", "");
        d.put("whatsapp", "");
        d.put("location", "");
        d.put("github", "https://github.com/wesleynyamosi");
        d.put("githubUser", "wesleynyamosi");
        d.put("linkedin", "https://www.linkedin.com/in/wesleynyamosi");
        // about page
        d.put("aboutTitle", "I build AI systems people can depend on.");
        d.put("aboutLede", "AI engineer and consultant. I work across the whole path from problem to production: "
                + "strategy, architecture, data, models, applications, evaluation and infrastructure.");
        d.put("aboutStory", String.join("\n\n",
                "I started in software and data engineering, building the backends, pipelines and cloud infrastructure that "
                        + "products run on. When large language models became practical, I saw the same pattern again and again: "
                        + "impressive prototypes that never reached the people they were meant for.",
                "That gap is where I work. I help organizations decide where AI is worth it, design systems that hold up under "
                        + "real use, and measure them honestly. Sometimes that means building an assistant or an agent. Sometimes "
                        + "it means deploying open-weight models on infrastructure the client controls. Sometimes it means advising "
                        + "not to use AI for a problem."));
        d.put("aboutBeyond", "Add a short, personal paragraph here: interests, community work, teaching, or what keeps you curious.");
        // footer
        d.put("footerText", "AI engineering & consulting. I design and build production-ready AI systems that solve real "
                + "business problems. Production matters more than demos.");
        // what is visible
        d.put("showSampleNotes", "true");
        for (String s : new String[] {"stats", "system", "github", "marquee", "philosophy", "build", "work", "howItWorks",
                "lab", "writing", "ask", "cta"}) {
            d.put("section." + s, "true");
        }
        DEFAULTS = Collections.unmodifiableMap(d);
    }

    private final SiteSettingRepository repo;
    private final FileStorageService files;

    public SiteService(SiteSettingRepository repo, FileStorageService files) {
        this.repo = repo;
        this.files = files;
    }

    @Transactional(readOnly = true)
    public SiteResponse site() {
        Map<String, String> values = new LinkedHashMap<>(DEFAULTS);
        for (SiteSetting s : repo.findAll()) {
            if (DEFAULTS.containsKey(s.getKey()) && s.getValue() != null) {
                values.put(s.getKey(), s.getValue());
            }
        }
        return new SiteResponse(values, files.info("photo"), files.info("cv"));
    }

    /** Saves the given keys. Unknown keys are rejected; an empty value for a text resets it to the default. */
    @Transactional
    public SiteResponse update(Map<String, String> changes) {
        if (changes == null || changes.isEmpty()) {
            return site();
        }
        for (Map.Entry<String, String> e : changes.entrySet()) {
            String key = e.getKey();
            if (!DEFAULTS.containsKey(key)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown setting: " + key);
            }
            String value = e.getValue() == null ? "" : e.getValue().trim();
            if (value.length() > 8000) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Setting " + key + " is too long");
            }
            if (value.equals(DEFAULTS.get(key))) {
                repo.deleteById(key);
            } else {
                repo.save(new SiteSetting(key, value));
            }
        }
        return site();
    }

    @Transactional
    public SiteResponse reset() {
        repo.deleteAll();
        return site();
    }
}
