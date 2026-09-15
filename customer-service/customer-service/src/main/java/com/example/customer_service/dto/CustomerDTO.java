package com.example.customer_service.dto;

// DTOs that separate the API contract from the internal entity model

import com.example.customer_service.entity.Customer.CustomerStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class CustomerDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50)
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50)
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

        @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Phone number is invalid")
        private String phone;

        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private CustomerStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
