package com.WesPortfolio.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.WesPortfolio.config.AppProperties;

/**
 * Creates and checks signed login tokens for the admin dashboard.
 *
 * A token looks like  v1.<base64(username:expiryEpochSeconds)>.<base64(HMAC-SHA256 signature)>
 * Only someone who knows the secret can create a valid signature, and the
 * expiry is inside the signed part, so it cannot be extended.
 */
@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);
    private static final Base64.Encoder ENC = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DEC = Base64.getUrlDecoder();

    private final byte[] secret;
    private final Duration lifetime;

    public TokenService(AppProperties props) {
        String configured = props.security() == null ? null : props.security().tokenSecret();
        if (configured == null || configured.isBlank()) {
            byte[] random = new byte[48];
            new SecureRandom().nextBytes(random);
            this.secret = random;
            log.info("No TOKEN_SECRET set: using a random one. Admin logins end when the API restarts.");
        } else {
            if (configured.length() < 32) {
                log.warn("TOKEN_SECRET is shorter than 32 characters. Use a longer random value in production.");
            }
            this.secret = configured.getBytes(StandardCharsets.UTF_8);
        }
        int hours = props.security() == null || props.security().tokenHours() <= 0 ? 12 : props.security().tokenHours();
        this.lifetime = Duration.ofHours(hours);
    }

    public Instant expiryFromNow() {
        return Instant.now().plus(lifetime);
    }

    public String create(String username, Instant expiresAt) {
        String payload = ENC.encodeToString((username + ":" + expiresAt.getEpochSecond()).getBytes(StandardCharsets.UTF_8));
        return "v1." + payload + "." + sign(payload);
    }

    /** Returns the username when the token is valid and not expired. */
    public Optional<String> verify(String token) {
        if (token == null) {
            return Optional.empty();
        }
        String[] parts = token.split("\\.");
        if (parts.length != 3 || !"v1".equals(parts[0])) {
            return Optional.empty();
        }
        byte[] expected = sign(parts[1]).getBytes(StandardCharsets.US_ASCII);
        byte[] given = parts[2].getBytes(StandardCharsets.US_ASCII);
        if (!MessageDigest.isEqual(expected, given)) {
            return Optional.empty();
        }
        try {
            String decoded = new String(DEC.decode(parts[1]), StandardCharsets.UTF_8);
            int sep = decoded.lastIndexOf(':');
            if (sep < 1) {
                return Optional.empty();
            }
            long exp = Long.parseLong(decoded.substring(sep + 1));
            if (Instant.now().getEpochSecond() >= exp) {
                return Optional.empty();
            }
            return Optional.of(decoded.substring(0, sep));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return ENC.encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Could not sign token", e);
        }
    }
}
