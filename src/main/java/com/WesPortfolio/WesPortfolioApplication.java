package com.WesPortfolio;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
/**
 * Entry point of the WesPortfolio API.
 *
 * Run locally without PostgreSQL:  ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
 * Run with PostgreSQL:             ./mvnw spring-boot:run
 * The API then listens on http://localhost:8080/api
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class WesPortfolioApplication {

	public static void main(String[] args) {
		applyRenderDatabaseUrl();
		SpringApplication.run(WesPortfolioApplication.class, args);
	}

	/**
	 * Render (and Heroku-style hosts) provide DATABASE_URL as postgres://user:password@host:port/database.
	 * JDBC needs jdbc:postgresql://host:port/database, with the user and password passed separately.
	 * When DATABASE_URL is present and SPRING_DATASOURCE_URL is not, convert it here.
	 */
	static void applyRenderDatabaseUrl() {
		String raw = System.getenv("DATABASE_URL");
		String explicit = System.getenv("SPRING_DATASOURCE_URL");
		if (raw == null || raw.isBlank() || (explicit != null && !explicit.isBlank())) {
			return;
		}
		raw = raw.trim();
		if (raw.startsWith("jdbc:")) {
			System.setProperty("spring.datasource.url", raw);
			return;
		}
		if (!raw.startsWith("postgres://") && !raw.startsWith("postgresql://")) {
			return;
		}
		try {
			URI uri = URI.create(raw.replaceFirst("^postgres(ql)?://", "http://"));
			String host = uri.getHost();
			int port = uri.getPort() > 0 ? uri.getPort() : 5432;
			String path = uri.getPath() == null ? "" : uri.getPath();
			StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(host).append(':').append(port).append(path);
			String query = uri.getQuery();
			boolean local = "localhost".equalsIgnoreCase(host) || "127.0.0.1".equals(host);
			if (query != null && !query.isBlank()) {
				jdbc.append('?').append(query);
			} else if (!local && host != null && host.contains(".")) {
				// External Render URLs need TLS; internal hostnames (no dot) do not.
				jdbc.append("?sslmode=require");
			}
			System.setProperty("spring.datasource.url", jdbc.toString());

			String userInfo = uri.getRawUserInfo();
			if (userInfo != null && !userInfo.isBlank()) {
				int sep = userInfo.indexOf(':');
				String user = sep >= 0 ? userInfo.substring(0, sep) : userInfo;
				System.setProperty("spring.datasource.username", URLDecoder.decode(user, StandardCharsets.UTF_8));
				if (sep >= 0) {
					System.setProperty("spring.datasource.password",
							URLDecoder.decode(userInfo.substring(sep + 1), StandardCharsets.UTF_8));
				}
			}
		} catch (IllegalArgumentException e) {
			System.err.println("DATABASE_URL could not be parsed; using spring.datasource.* settings instead: " + e.getMessage());
		}
	}
}
