package com.example.customer_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables JPA Auditing so that @CreatedDate and @LastModifiedDate
 * are automatically filled in the Customer entity.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
