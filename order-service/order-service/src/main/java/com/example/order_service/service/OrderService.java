package com.example.order_service.service;

import com.example.order_service.dto.OrderDTO;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.Order.OrderStatus;
import com.example.order_service.exception.OrderNotFoundException;
import com.example.order_service.mapper.OrderMapper;
import com.example.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderDTO.Response createOrder(OrderDTO.Request request) {
        log.info("Creating order for customer: {}", request.getCustomerId());
        Order order = orderMapper.toEntity(request);
        Order saved = orderRepository.save(order);
        log.info("Order created with id: {}", saved.getId());
        return orderMapper.toResponse(saved);
    }

    public List<OrderDTO.Response> getAllOrders() {
        return orderRepository.findAll().stream().map(orderMapper::toResponse).toList();
    }

    public OrderDTO.Response getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return orderMapper.toResponse(order);
    }

    public List<OrderDTO.Response> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId)
                .stream().map(orderMapper::toResponse).toList();
    }

    public List<OrderDTO.Response> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream().map(orderMapper::toResponse).toList();
    }

    @Transactional
    public OrderDTO.Response updateOrderStatus(Long id, OrderStatus newStatus) {
        log.info("Updating order {} status to {}", id, newStatus);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        order.setStatus(newStatus);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) throw new OrderNotFoundException(id);
        orderRepository.deleteById(id);
        log.info("Order deleted with id: {}", id);
    }
}
