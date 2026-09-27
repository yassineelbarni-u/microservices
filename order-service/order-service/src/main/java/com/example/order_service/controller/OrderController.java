package com.example.order_service.controller;

import com.example.order_service.dto.OrderDTO;
import com.example.order_service.entity.Order.OrderStatus;
import com.example.order_service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO.Response> createOrder(@Valid @RequestBody OrderDTO.Request request) {
        OrderDTO.Response created = orderService.createOrder(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO.Response>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Long customerId) {

        if (status != null) return ResponseEntity.ok(orderService.getOrdersByStatus(status));
        if (customerId != null) return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO.Response> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO.Response> updateStatus(
            @PathVariable Long id, @RequestParam OrderStatus newStatus) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
