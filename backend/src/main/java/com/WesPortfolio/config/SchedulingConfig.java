package com.WesPortfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Turns on scheduled jobs (daily clean-up of old visitor events). */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
