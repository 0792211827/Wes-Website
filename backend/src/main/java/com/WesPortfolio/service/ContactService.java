package com.WesPortfolio.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.WesPortfolio.config.AppProperties;
import com.WesPortfolio.domain.Lead;
import com.WesPortfolio.domain.LeadStatus;
import com.WesPortfolio.dto.ApiDtos.ContactRequest;
import com.WesPortfolio.dto.ApiDtos.LeadDto;
import com.WesPortfolio.dto.ApiDtos.LeadUpdateRequest;
import com.WesPortfolio.repository.LeadRepository;

/**
 * Stores consulting enquiries and, when email is configured, notifies Wesley
 * and sends the visitor a short acknowledgement. Email problems never lose a lead.
 */
@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final LeadRepository leads;
    private final ObjectProvider<JavaMailSender> mailSender;
    private final AppProperties props;
    private final Environment env;

    public ContactService(LeadRepository leads, ObjectProvider<JavaMailSender> mailSender, AppProperties props,
            Environment env) {
        this.leads = leads;
        this.mailSender = mailSender;
        this.props = props;
        this.env = env;
    }

    @Transactional
    public Lead receive(ContactRequest req, String ipHash, String userAgent) {
        Lead lead = new Lead();
        lead.setName(req.name().trim());
        lead.setEmail(req.email().trim());
        lead.setCompany(blankToNull(req.company()));
        lead.setRole(blankToNull(req.role()));
        lead.setServices(req.services().stream().map(String::trim).filter(s -> !s.isEmpty()).distinct().toList());
        lead.setProblem(req.problem().trim());
        lead.setBudget(blankToNull(req.budget()));
        lead.setTimeline(blankToNull(req.timeline()));
        lead.setIpHash(ipHash);
        lead.setUserAgent(userAgent == null ? null : userAgent.substring(0, Math.min(300, userAgent.length())));
        Lead saved = leads.save(lead);
        sendEmails(saved);
        return saved;
    }

    /* ------------------------------ admin ------------------------------ */

    @Transactional(readOnly = true)
    public List<LeadDto> all() {
        return leads.findAllByOrderByCreatedAtDesc().stream().map(ContactService::toDto).toList();
    }

    @Transactional
    public LeadDto update(Long id, LeadUpdateRequest req) {
        Lead lead = leads.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
        if (req.status() != null) {
            lead.setStatus(req.status());
        }
        if (req.notes() != null) {
            lead.setNotes(req.notes().isBlank() ? null : req.notes().trim());
        }
        return toDto(leads.saveAndFlush(lead));
    }

    @Transactional
    public void delete(Long id) {
        if (!leads.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found");
        }
        leads.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long count() {
        return leads.count();
    }

    @Transactional(readOnly = true)
    public long countNew() {
        return leads.countByStatus(LeadStatus.NEW);
    }

    public static LeadDto toDto(Lead l) {
        return new LeadDto(l.getId(), l.getName(), l.getEmail(), l.getCompany(), l.getRole(),
                l.getServices() == null ? List.of() : List.copyOf(l.getServices()),
                l.getProblem(), l.getBudget(), l.getTimeline(), l.getStatus(), l.getNotes(),
                l.getCreatedAt(), l.getUpdatedAt());
    }

    /* ------------------------------ email ------------------------------ */

    private void sendEmails(Lead lead) {
        JavaMailSender sender = mailSender.getIfAvailable();
        String host = env.getProperty("spring.mail.host");
        if (sender == null || host == null || host.isBlank()) {
            return; // email not configured: the lead is still in the dashboard
        }
        AppProperties.Mail mail = props.mail();
        String from = mail == null ? null : mail.from();
        String notifyTo = mail == null ? null : mail.notifyTo();

        if (notifyTo != null && !notifyTo.isBlank()) {
            try {
                SimpleMailMessage m = new SimpleMailMessage();
                m.setTo(notifyTo);
                if (from != null && !from.isBlank()) {
                    m.setFrom(from);
                }
                m.setReplyTo(lead.getEmail());
                m.setSubject("New enquiry: " + String.join(", ", lead.getServices()) + " (" + lead.getName()
                        + (lead.getCompany() == null ? "" : ", " + lead.getCompany()) + ")");
                m.setText("Name:      " + lead.getName()
                        + "\nEmail:     " + lead.getEmail()
                        + "\nCompany:   " + orDash(lead.getCompany())
                        + "\nRole:      " + orDash(lead.getRole())
                        + "\nLooking for: " + String.join(", ", lead.getServices())
                        + "\nBudget:    " + orDash(lead.getBudget())
                        + "\nTimeline:  " + orDash(lead.getTimeline())
                        + "\n\nProblem:\n" + lead.getProblem()
                        + "\n\n---\nLead #" + lead.getId() + ". Reply to this email to answer directly.");
                sender.send(m);
            } catch (Exception e) {
                log.warn("Saved lead {} but could not send the notification email: {}", lead.getId(), e.getMessage());
            }
        }

        if (mail != null && mail.sendAcknowledgement()) {
            try {
                SimpleMailMessage ack = new SimpleMailMessage();
                ack.setTo(lead.getEmail());
                if (from != null && !from.isBlank()) {
                    ack.setFrom(from);
                }
                if (notifyTo != null && !notifyTo.isBlank()) {
                    ack.setReplyTo(notifyTo);
                }
                ack.setSubject("Thanks for getting in touch");
                ack.setText("Hi " + firstName(lead.getName()) + ",\n\n"
                        + "Thanks for telling me about the problem you're working on. I've received your message "
                        + "and will reply by email.\n\n"
                        + "Best regards,\nWesley Nyamosi\nAI Engineering");
                sender.send(ack);
            } catch (Exception e) {
                log.warn("Could not send the acknowledgement email for lead {}: {}", lead.getId(), e.getMessage());
            }
        }
    }

    public static String firstName(String name) {
        String n = name == null ? "" : name.trim();
        int sp = n.indexOf(' ');
        return sp > 0 ? n.substring(0, sp) : n;
    }

    private static String orDash(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
