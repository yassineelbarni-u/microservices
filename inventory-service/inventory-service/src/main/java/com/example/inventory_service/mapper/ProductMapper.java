package com.example.inventory_service.mapper;

import com.example.inventory_service.dto.ProductDTO;
import com.example.inventory_service.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductDTO.Request dto) {
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .category(dto.getCategory())
                .build();
    }

    public ProductDTO.Response toResponse(Product product) {
        return ProductDTO.Response.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDto(ProductDTO.Request dto, Product product) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setCategory(dto.getCategory());
    }
}
