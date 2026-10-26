package com.WesPortfolio.web;

import java.time.Duration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.config.AppProperties;
import com.WesPortfolio.domain.Lead;
import com.WesPortfolio.dto.ApiDtos.ContactRequest;
import com.WesPortfolio.dto.ApiDtos.ContactResponse;
import com.WesPortfolio.security.IpHasher;
import com.WesPortfolio.security.RateLimiter;
import com.WesPortfolio.service.ContactService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Contact form endpoint. The site no longer has a contact page (removed 2026-10-25); kept for the API contract and stored leads.
 */
@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contact;
    private final IpHasher ipHasher;
    private final RateLimiter limiter;

    public ContactController(ContactService contact, IpHasher ipHasher, AppProperties props) {
        this.contact = contact;
        this.ipHasher = ipHasher;
        this.limiter = new RateLimiter(props.contactPerHour(), Duration.ofHours(1));
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> contact(@Valid @RequestBody ContactRequest body, HttpServletRequest request) {
        if (body.website() != null && !body.website().isBlank()) {
            // A bot filled the hidden field: pretend success, store nothing.
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ContactResponse(null, "Thanks, message received."));
        }
        String ipHash = ipHasher.hash(ClientIp.of(request));
        if (!limiter.tryAcquire(ipHash)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "You've sent several messages in a short time. Please try again later or email directly.");
        }
        Lead lead = contact.receive(body, ipHash, request.getHeader("User-Agent"));
        String first = ContactService.firstName(lead.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(new ContactResponse(lead.getId(),
                "Thanks, " + first + ". Message received."));
    }
}
