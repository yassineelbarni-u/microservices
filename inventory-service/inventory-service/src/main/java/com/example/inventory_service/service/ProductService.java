package com.example.inventory_service.service;

import com.example.inventory_service.dto.ProductDTO;
import com.example.inventory_service.entity.Product;
import com.example.inventory_service.entity.Product.ProductStatus;
import com.example.inventory_service.exception.ProductAlreadyExistsException;
import com.example.inventory_service.exception.ProductNotFoundException;
import com.example.inventory_service.mapper.ProductMapper;
import com.example.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductDTO.Response createProduct(ProductDTO.Request request) {
        log.info("Creating product: {} in category: {}", request.getName(), request.getCategory());

        if (productRepository.existsByNameAndCategory(request.getName(), request.getCategory())) {
            throw new ProductAlreadyExistsException(request.getName(), request.getCategory());
        }

        Product product = productMapper.toEntity(request);
        Product saved = productRepository.save(product);

        log.info("Product created with id: {}", saved.getId());
        return productMapper.toResponse(saved);
    }

    public List<ProductDTO.Response> getAllProducts() {
        log.debug("Fetching all products");
        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    public ProductDTO.Response getProductById(Long id) {
        log.debug("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return productMapper.toResponse(product);
    }

    public List<ProductDTO.Response> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream().map(productMapper::toResponse).toList();
    }

    public List<ProductDTO.Response> getProductsByStatus(ProductStatus status) {
        return productRepository.findByStatus(status)
                .stream().map(productMapper::toResponse).toList();
    }

    public List<ProductDTO.Response> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword)
                .stream().map(productMapper::toResponse).toList();
    }

    public List<ProductDTO.Response> getLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold)
                .stream().map(productMapper::toResponse).toList();
    }

    @Transactional
    public ProductDTO.Response updateProduct(Long id, ProductDTO.Request request) {
        log.info("Updating product with id: {}", id);

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productMapper.updateEntityFromDto(request, existing);

        // Auto-update status based on quantity
        if (existing.getQuantity() == 0) {
            existing.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (existing.getStatus() == ProductStatus.OUT_OF_STOCK) {
            existing.setStatus(ProductStatus.AVAILABLE);
        }

        Product updated = productRepository.save(existing);
        log.info("Product updated with id: {}", updated.getId());
        return productMapper.toResponse(updated);
    }

    @Transactional
    public ProductDTO.Response changeProductStatus(Long id, ProductStatus newStatus) {
        log.info("Changing status of product {} to {}", id, newStatus);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setStatus(newStatus);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted with id: {}", id);
    }
}
