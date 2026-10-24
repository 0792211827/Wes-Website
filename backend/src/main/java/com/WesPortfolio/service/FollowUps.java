package com.WesPortfolio.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Two suggested next questions shown under each answer of "Ask Wesley's AI",
 * chosen from the topic of the best-matching document.
 */
final class FollowUps {

    private static final List<String> GENERAL = List.of(
            "What kind of AI systems does Wesley build?",
            "How does an engagement with Wesley work?",
            "Show me his work with RAG.",
            "Can Wesley help us evaluate our AI system?",
            "Does Wesley deploy open-weight models?",
            "How can I contact Wesley?");

    private static final Map<String, List<String>> BY_KEY = Map.ofEntries(
            Map.entry("what-build", List.of("Show me his work with RAG.", "How does an engagement with Wesley work?")),
            Map.entry("rag", List.of("How does Wesley evaluate RAG quality?", "Can the assistant respect document permissions?")),
            Map.entry("evaluate", List.of("What metrics does Wesley use?", "How long does an evaluation sprint take?")),
            Map.entry("philosophy", List.of("What kind of AI systems does Wesley build?", "How does an engagement with Wesley work?")),
            Map.entry("infra", List.of("How much can self-hosting save?", "Which serving engine does Wesley use?")),
            Map.entry("voice", List.of("How fast does the voice agent respond?", "Can a voice agent hand off to a human?")),
            Map.entry("agents", List.of("How are agent actions kept safe?", "Show me the Agentic Operations Copilot.")),
            Map.entry("engage", List.of("How quickly can we start?", "How can I contact Wesley?")),
            Map.entry("contact", List.of("How does an engagement with Wesley work?", "What kind of AI systems does Wesley build?")),
            Map.entry("stack", List.of("Does Wesley deploy open-weight models?", "Show me his work with RAG.")),
            Map.entry("training", List.of("How does an engagement with Wesley work?", "How can I contact Wesley?")),
            Map.entry("lab", List.of("Which serving engine is faster, vLLM or TGI?", "Does quantization hurt quality?")),
            Map.entry("writing", List.of("Why do AI projects fail in production?", "How should LLM apps be evaluated?")),
            Map.entry("about", List.of("What kind of AI systems does Wesley build?", "What does Wesley believe about production AI?")),
            Map.entry("portfolio", List.of("Show me his work with RAG.", "Tell me about the voice agent project.")));

    private FollowUps() {
    }

    static List<String> forKey(String key, String question) {
        List<String> base;
        if (key == null) {
            base = GENERAL;
        } else if (key.startsWith("project:")) {
            base = List.of("How was this system evaluated?", "How does an engagement with Wesley work?");
        } else if (key.startsWith("lab:")) {
            base = List.of("What else is in the AI Lab?", "Does Wesley deploy open-weight models?");
        } else if (key.startsWith("post:")) {
            base = List.of("What other articles has Wesley written?", "Can Wesley help us with this?");
        } else {
            base = BY_KEY.getOrDefault(key, GENERAL);
        }
        List<String> out = new ArrayList<>();
        String q = question == null ? "" : question.trim().toLowerCase();
        for (String s : base) {
            if (!s.toLowerCase().equals(q) && out.size() < 2) {
                out.add(s);
            }
        }
        for (String s : GENERAL) {
            if (out.size() >= 2) {
                break;
            }
            if (!out.contains(s) && !s.toLowerCase().equals(q)) {
                out.add(s);
            }
        }
        return out;
    }
}
