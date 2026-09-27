package com.example.order_service.config;

import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    @Profile("!prod")
    public CommandLineRunner initData(OrderRepository orderRepository) {
        return args -> {
            if (orderRepository.count() == 0) {
                log.info("Seeding initial order data...");

                Order order1 = Order.builder()
                        .customerId(1L).status(Order.OrderStatus.DELIVERED)
                        .totalAmount(13299.98).build();
                OrderItem item1 = OrderItem.builder()
                        .productId(1L).productName("Laptop Pro 15")
                        .unitPrice(12999.99).quantity(1).order(order1).build();
                OrderItem item2 = OrderItem.builder()
                        .productId(2L).productName("Wireless Mouse")
                        .unitPrice(299.99).quantity(1).order(order1).build();
                order1.setItems(List.of(item1, item2));
                orderRepository.save(order1);

                Order order2 = Order.builder()
                        .customerId(2L).status(Order.OrderStatus.PENDING)
                        .totalAmount(799.99).build();
                OrderItem item3 = OrderItem.builder()
                        .productId(3L).productName("Mechanical Keyboard")
                        .unitPrice(799.99).quantity(1).order(order2).build();
                order2.setItems(List.of(item3));
                orderRepository.save(order2);

                log.info("Seeded {} orders successfully", orderRepository.count());
            }
        };
    }
}
