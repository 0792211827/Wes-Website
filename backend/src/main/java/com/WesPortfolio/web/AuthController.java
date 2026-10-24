package com.WesPortfolio.web;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.config.AppProperties;
import com.WesPortfolio.dto.ApiDtos.LoginRequest;
import com.WesPortfolio.dto.ApiDtos.LoginResponse;
import com.WesPortfolio.security.RateLimiter;
import com.WesPortfolio.security.TokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Admin login. Returns a token the dashboard sends as "Authorization: Bearer ...".
 */
@RestController
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AppProperties props;
    private final TokenService tokens;
    private final RateLimiter loginLimiter = new RateLimiter(5, Duration.ofMinutes(15));

    public AuthController(AppProperties props, TokenService tokens) {
        this.props = props;
        this.tokens = tokens;
        if (props.admin() == null || props.admin().password() == null || props.admin().password().isBlank()) {
            log.warn("ADMIN_PASSWORD is not set, so admin login is disabled.");
        }
    }

    @PostMapping("/api/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest body, HttpServletRequest request) {
        if (!loginLimiter.tryAcquire(ClientIp.of(request))) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many attempts. Wait 15 minutes and try again.");
        }
        String user = props.admin() == null ? null : props.admin().username();
        String pass = props.admin() == null ? null : props.admin().password();
        boolean userOk = constantTimeEquals(body.username(), user);
        boolean passOk = constantTimeEquals(body.password(), pass);
        if (!userOk || !passOk) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "The username or password is incorrect");
        }
        Instant exp = tokens.expiryFromNow();
        return new LoginResponse(tokens.create(body.username(), exp), exp);
    }

    /** Lets the dashboard check that its saved token is still valid. */
    @GetMapping("/api/admin/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of("username", auth.getName());
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || b.isBlank()) {
            return false;
        }
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}
