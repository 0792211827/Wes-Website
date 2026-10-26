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
        d.put("role", "AI Engineering");
        d.put("headline", "Building [[real value]] in the AI generation.");
        d.put("support", "I build AI systems that turn models into something useful: agents and RAG pipelines, "
                + "open-weight LLMs deployed locally, and fast inference with engines like vLLM and Ollama.");
        d.put("availability", "open to opportunities");
        d.put("showStamp", "true");
        d.put("heroTags", String.join("\n",
                "AI Agents|c-sky", "RAG|c-green", "LLMs|c-amber", "Local Deployment|c-teal",
                "vLLM|c-orange", "Ollama|c-violet", "Python|c-cream"));
        // contact & links
        d.put("email", "nyamosiwesley02@gmail.com");
        d.put("whatsapp", "");
        d.put("location", "");
        d.put("github", "https://github.com/0792211827");
        d.put("githubUser", "0792211827");
        d.put("linkedin", "https://www.linkedin.com/in/wesley-nyamosi-809409251");
        d.put("x", "https://x.com/nyamosiW");
        // footer
        d.put("footerText", "AI engineering. I build AI systems that create real value in the AI generation. "
                + "Production matters more than demos.");
        // what is visible
        d.put("showSampleNotes", "true");
        // home page sections, then work page sections
        for (String s : new String[] {"github", "pillars", "philosophy", "ask", "cta", "system"}) {
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
