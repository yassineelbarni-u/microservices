package com.example.order_service.dto;

import com.example.order_service.entity.Order.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {
        @NotNull(message = "Customer ID is required")
        private Long customerId;

        @NotEmpty(message = "Order must contain at least one item")
        @Valid
        private List<OrderItemDTO.Request> items;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long customerId;
        private OrderStatus status;
        private Double totalAmount;
        private List<OrderItemDTO.Response> items;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
