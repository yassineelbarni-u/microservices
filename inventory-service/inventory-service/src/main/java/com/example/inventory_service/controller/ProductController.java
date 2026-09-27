package com.example.inventory_service.controller;

import com.example.inventory_service.dto.ProductDTO;
import com.example.inventory_service.entity.Product.ProductStatus;
import com.example.inventory_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDTO.Response> createProduct(
            @Valid @RequestBody ProductDTO.Request request) {

        ProductDTO.Response created = productService.createProduct(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO.Response>> getAllProducts(
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer lowStock) {

        if (status != null) return ResponseEntity.ok(productService.getProductsByStatus(status));
        if (category != null && !category.isBlank()) return ResponseEntity.ok(productService.getProductsByCategory(category));
        if (search != null && !search.isBlank()) return ResponseEntity.ok(productService.searchProducts(search));
        if (lowStock != null) return ResponseEntity.ok(productService.getLowStockProducts(lowStock));
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO.Response> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO.Response> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO.Request request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductDTO.Response> changeStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus newStatus) {
        return ResponseEntity.ok(productService.changeProductStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
