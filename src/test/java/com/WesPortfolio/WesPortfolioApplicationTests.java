package com.WesPortfolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/** Starts the whole application against the in-memory H2 database (profile "local"). */
@SpringBootTest
@ActiveProfiles("local")
class WesPortfolioApplicationTests {

	@Test
	void contextLoads() {
	}

}
