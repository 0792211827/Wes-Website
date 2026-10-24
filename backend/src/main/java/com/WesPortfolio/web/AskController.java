package com.WesPortfolio.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WesPortfolio.dto.ApiDtos.AskRequest;
import com.WesPortfolio.dto.ApiDtos.AskResponse;
import com.WesPortfolio.security.IpHasher;
import com.WesPortfolio.service.AskService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * "Ask Wesley's AI": answers from approved website content, with sources.
 */
@RestController
@RequestMapping("/api/ask")
public class AskController {

    private final AskService ask;
    private final IpHasher ipHasher;

    public AskController(AskService ask, IpHasher ipHasher) {
        this.ask = ask;
        this.ipHasher = ipHasher;
    }

    @PostMapping
    public AskResponse ask(@Valid @RequestBody AskRequest body, HttpServletRequest request) {
        return ask.ask(body.question(), body.sessionId(), ipHasher.hash(ClientIp.of(request)));
    }

    @GetMapping("/suggestions")
    public List<String> suggestions() {
        return ask.suggestions();
    }
}
