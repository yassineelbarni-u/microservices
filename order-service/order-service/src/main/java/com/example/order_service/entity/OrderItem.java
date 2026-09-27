package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product ID is required")
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Order order;

    public Double getSubtotal() {
        return unitPrice * quantity;
    }
}
