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
            "Show me his work with RAG.",
            "What is Wesley's background?",
            "Does Wesley deploy open-weight models?",
            "Does Wesley offer consulting?",
            "How can I contact Wesley?");

    private static final Map<String, List<String>> BY_KEY = Map.ofEntries(
            Map.entry("what-build", List.of("Show me his work with RAG.", "Does Wesley deploy open-weight models?")),
            Map.entry("rag", List.of("How does Wesley evaluate AI systems?", "Does Wesley deploy open-weight models?")),
            Map.entry("evaluate", List.of("Show me his work with RAG.", "How can I contact Wesley?")),
            Map.entry("philosophy", List.of("What kind of AI systems does Wesley build?", "What is Wesley's background?")),
            Map.entry("infra", List.of("Which tools does Wesley use?", "How does Wesley evaluate AI systems?")),
            Map.entry("voice", List.of("How are agent actions kept safe?", "Which tools does Wesley use?")),
            Map.entry("agents", List.of("Tell me about his voice agent.", "How does Wesley evaluate AI systems?")),
            Map.entry("engage", List.of("How can I contact Wesley?", "What kind of AI systems does Wesley build?")),
            Map.entry("contact", List.of("What kind of AI systems does Wesley build?", "What is Wesley's background?")),
            Map.entry("stack", List.of("Does Wesley deploy open-weight models?", "Show me his work with RAG.")),
            Map.entry("writing", List.of("Show me his work with RAG.", "What does Wesley believe about production AI?")),
            Map.entry("about", List.of("What kind of AI systems does Wesley build?", "Which tools does Wesley use?")),
            Map.entry("portfolio", List.of("Show me his work with RAG.", "Tell me about his voice agent.")));

    private FollowUps() {
    }

    static List<String> forKey(String key, String question) {
        List<String> base;
        if (key == null) {
            base = GENERAL;
        } else if (key.startsWith("project:")) {
            base = List.of("Which tools does Wesley use?", "How can I contact Wesley?");
        } else if (key.startsWith("post:")) {
            base = List.of("What other articles has Wesley written?", "Does Wesley offer consulting?");
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
