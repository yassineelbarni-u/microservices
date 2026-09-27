package com.example.order_service.mapper;

import com.example.order_service.dto.OrderDTO;
import com.example.order_service.dto.OrderItemDTO;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public Order toEntity(OrderDTO.Request dto) {
        Order order = Order.builder()
                .customerId(dto.getCustomerId())
                .build();

        List<OrderItem> items = dto.getItems().stream()
                .map(itemDto -> OrderItem.builder()
                        .productId(itemDto.getProductId())
                        .productName(itemDto.getProductName())
                        .unitPrice(itemDto.getUnitPrice())
                        .quantity(itemDto.getQuantity())
                        .order(order)
                        .build())
                .toList();

        order.setItems(items);
        order.setTotalAmount(items.stream().mapToDouble(OrderItem::getSubtotal).sum());
        return order;
    }

    public OrderDTO.Response toResponse(Order order) {
        List<OrderItemDTO.Response> itemResponses = order.getItems().stream()
                .map(item -> OrderItemDTO.Response.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return OrderDTO.Response.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
