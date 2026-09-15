package com.example.customer_service.config;

import com.example.customer_service.entity.Customer;
import com.example.customer_service.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Seeds the database with demo customers at startup.
 * Only runs when the "default" or "dev" profile is active.
 * Never runs in "prod" profile.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    @Profile("!prod")
    public CommandLineRunner initData(CustomerRepository customerRepository) {
        return args -> {
            if (customerRepository.count() == 0) {
                log.info("Seeding initial customer data...");

                customerRepository.save(Customer.builder()
                        .firstName("Yassine")
                        .lastName("El Barni")
                        .email("yassine@example.com")
                        .phone("+212600000001")
                        .address("Casablanca, Maroc")
                        .status(Customer.CustomerStatus.ACTIVE)
                        .build());

                customerRepository.save(Customer.builder()
                        .firstName("Amine")
                        .lastName("Alaoui")
                        .email("amine@example.com")
                        .phone("+212600000002")
                        .address("Rabat, Maroc")
                        .status(Customer.CustomerStatus.ACTIVE)
                        .build());

                customerRepository.save(Customer.builder()
                        .firstName("Sara")
                        .lastName("Benali")
                        .email("sara@example.com")
                        .phone("+212600000003")
                        .address("Marrakech, Maroc")
                        .status(Customer.CustomerStatus.INACTIVE)
                        .build());

                log.info("Seeded {} customers successfully", customerRepository.count());
            }
        };
    }
}
