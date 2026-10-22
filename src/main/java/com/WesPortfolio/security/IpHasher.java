package com.WesPortfolio.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.stereotype.Component;

import com.WesPortfolio.config.AppProperties;

/**
 * Turns a visitor IP into a salted SHA-256 hash, so logs can count unique
 * visitors and spot abuse without ever storing the IP itself.
 */
@Component
public class IpHasher {

    private final String salt;

    public IpHasher(AppProperties props) {
        String configured = props.security() == null ? null : props.security().ipSalt();
        this.salt = configured == null || configured.isBlank() ? "wes-portfolio" : configured;
    }

    public String hash(String ip) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] digest = sha.digest((salt + "|" + (ip == null ? "unknown" : ip)).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
