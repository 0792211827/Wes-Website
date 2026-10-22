package com.WesPortfolio.web;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Turns validation problems into clear messages the Angular app can show next to each field:
 * { "title": "Please check the form", "detail": "...", "fields": { "email": "..." } }
 * Other errors (404, 429, 503...) are ProblemDetail bodies produced by Spring itself.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail invalid(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(f -> fields.putIfAbsent(fieldName(f.getField()), f.getDefaultMessage()));
        String first = fields.values().stream().findFirst().orElse("Some fields are not valid");
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, first);
        pd.setTitle("Please check the form");
        pd.setProperty("fields", fields);
        return pd;
    }

    /** "services[0]" becomes "services" so the form can highlight the right field. */
    private static String fieldName(String path) {
        int bracket = path.indexOf('[');
        return bracket > 0 ? path.substring(0, bracket) : path;
    }
}
