package com.WesPortfolio.security;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Very small in-memory limiter: at most {@code max} actions per key in a time window.
 * Good enough for a single-server portfolio (login attempts, contact messages, AI questions).
 */
public class RateLimiter {

    private final int max;
    private final long windowMillis;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimiter(int max, Duration window) {
        this.max = max;
        this.windowMillis = window.toMillis();
    }

    /** Records an attempt and returns false when the limit is reached. */
    public boolean tryAcquire(String key) {
        long now = System.currentTimeMillis();
        Deque<Long> q = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > windowMillis) {
                q.pollFirst();
            }
            if (q.size() >= max) {
                return false;
            }
            q.addLast(now);
        }
        if (hits.size() > 10_000) {
            hits.entrySet().removeIf(e -> e.getValue().isEmpty());
        }
        return true;
    }

    /** How many more actions this key may take in the current window (does not record anything). */
    public int remaining(String key) {
        Deque<Long> q = hits.get(key);
        if (q == null) {
            return max;
        }
        long now = System.currentTimeMillis();
        synchronized (q) {
            long recent = q.stream().filter(t -> now - t <= windowMillis).count();
            return (int) Math.max(0, max - recent);
        }
    }
}
