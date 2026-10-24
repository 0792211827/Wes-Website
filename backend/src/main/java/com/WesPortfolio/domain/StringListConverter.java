package com.WesPortfolio.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Stores a list of strings as one TEXT column, one item per line.
 * Line breaks inside an item are replaced by spaces; structured items
 * (pairs, decisions, rows) use tab-separated parts on each line.
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    @Override
    public String convertToDatabaseColumn(List<String> items) {
        if (items == null || items.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (String item : items) {
            if (item == null) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append('\n');
            }
            sb.append(item.replace("\r", " ").replace("\n", " "));
        }
        return sb.toString();
    }

    @Override
    public List<String> convertToEntityAttribute(String column) {
        List<String> out = new ArrayList<>();
        if (column == null || column.isEmpty()) {
            return out;
        }
        for (String line : column.split("\n", -1)) {
            if (!line.isEmpty()) {
                out.add(line);
            }
        }
        return out;
    }
}
