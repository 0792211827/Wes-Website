package com.WesPortfolio.service;

/**
 * Tiny JSON helpers for the few places the API talks JSON to other services by hand
 * (the optional LLM call). Kept dependency-free on purpose.
 */
public final class JsonText {

    private JsonText() {
    }

    /** Returns s as a quoted JSON string literal. */
    public static String quote(String s) {
        if (s == null) {
            return "null";
        }
        StringBuilder sb = new StringBuilder(s.length() + 16).append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                case '\b' -> sb.append("\\b");
                case '\f' -> sb.append("\\f");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.append('"').toString();
    }

    /**
     * Reads choices[0].message.content from an OpenAI-compatible chat completion response.
     * Returns null when it cannot be found.
     */
    public static String chatContent(String json) {
        if (json == null) {
            return null;
        }
        int choices = json.indexOf("\"choices\"");
        if (choices < 0) {
            return null;
        }
        int message = json.indexOf("\"message\"", choices);
        int from = message >= 0 ? message : choices;
        int key = json.indexOf("\"content\"", from);
        if (key < 0) {
            return null;
        }
        int i = key + "\"content\"".length();
        while (i < json.length() && Character.isWhitespace(json.charAt(i))) {
            i++;
        }
        if (i >= json.length() || json.charAt(i) != ':') {
            return null;
        }
        i++;
        while (i < json.length() && Character.isWhitespace(json.charAt(i))) {
            i++;
        }
        if (i >= json.length() || json.charAt(i) != '"') {
            return null; // null content (e.g. a tool call) or unexpected shape
        }
        return readString(json, i);
    }

    /** Reads the JSON string literal that starts at index start (the opening quote). */
    static String readString(String json, int start) {
        StringBuilder sb = new StringBuilder();
        int i = start + 1;
        while (i < json.length()) {
            char c = json.charAt(i);
            if (c == '"') {
                return sb.toString();
            }
            if (c == '\\' && i + 1 < json.length()) {
                char e = json.charAt(i + 1);
                switch (e) {
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case 'b' -> sb.append('\b');
                    case 'f' -> sb.append('\f');
                    case '/' -> sb.append('/');
                    case '\\' -> sb.append('\\');
                    case '"' -> sb.append('"');
                    case 'u' -> {
                        if (i + 5 < json.length()) {
                            try {
                                sb.append((char) Integer.parseInt(json.substring(i + 2, i + 6), 16));
                            } catch (NumberFormatException ex) {
                                return null;
                            }
                            i += 4;
                        } else {
                            return null;
                        }
                    }
                    default -> sb.append(e);
                }
                i += 2;
                continue;
            }
            sb.append(c);
            i++;
        }
        return null; // unterminated string
    }
}
