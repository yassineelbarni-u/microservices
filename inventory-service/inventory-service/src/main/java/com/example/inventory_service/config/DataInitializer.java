package com.example.inventory_service.config;

import com.example.inventory_service.entity.Product;
import com.example.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    @Profile("!prod")
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                log.info("Seeding initial product data...");

                productRepository.save(Product.builder()
                        .name("Laptop Pro 15").description("High performance laptop for professionals")
                        .price(12999.99).quantity(50).category("Electronics")
                        .status(Product.ProductStatus.AVAILABLE).build());

                productRepository.save(Product.builder()
                        .name("Wireless Mouse").description("Ergonomic wireless mouse with long battery life")
                        .price(299.99).quantity(200).category("Electronics")
                        .status(Product.ProductStatus.AVAILABLE).build());

                productRepository.save(Product.builder()
                        .name("Mechanical Keyboard").description("RGB mechanical keyboard with Cherry MX switches")
                        .price(799.99).quantity(75).category("Electronics")
                        .status(Product.ProductStatus.AVAILABLE).build());

                productRepository.save(Product.builder()
                        .name("Office Chair").description("Ergonomic office chair with lumbar support")
                        .price(2499.99).quantity(30).category("Furniture")
                        .status(Product.ProductStatus.AVAILABLE).build());

                productRepository.save(Product.builder()
                        .name("USB-C Hub").description("7-in-1 USB-C hub with 4K HDMI")
                        .price(449.99).quantity(0).category("Electronics")
                        .status(Product.ProductStatus.OUT_OF_STOCK).build());

                log.info("Seeded {} products successfully", productRepository.count());
            }
        };
    }
}
