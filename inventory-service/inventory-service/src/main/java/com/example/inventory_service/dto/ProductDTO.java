package com.example.inventory_service.dto;

import com.example.inventory_service.entity.Product.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class ProductDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "Product name is required")
        @Size(min = 2, max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        private Double price;

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        private Integer quantity;

        @NotBlank(message = "Category is required")
        private String category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer quantity;
        private String category;
        private ProductStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
