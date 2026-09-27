package com.example.order_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class OrderItemDTO {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotBlank(message = "Product name is required")
        private String productName;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false)
        private Double unitPrice;

        @NotNull
        @Min(value = 1)
        private Integer quantity;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long productId;
        private String productName;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;
    }
}
