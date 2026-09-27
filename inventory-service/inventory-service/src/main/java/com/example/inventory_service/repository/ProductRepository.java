package com.example.inventory_service.repository;

import com.example.inventory_service.entity.Product;
import com.example.inventory_service.entity.Product.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByStatus(ProductStatus status);

    boolean existsByNameAndCategory(String name, String category);

    // Case-insensitive search across name and description
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    // Find products with low stock
    @Query("SELECT p FROM Product p WHERE p.quantity <= :threshold AND p.status = 'AVAILABLE'")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
}
