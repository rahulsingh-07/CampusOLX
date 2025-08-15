package com.example.olx.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductModel, UUID> {

    List<ProductModel> findAllByUserUserid(UUID userid);

    List<ProductModel> findByUploadedAtBefore(LocalDateTime oneWeekAgo);
    Page<ProductModel> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);

}
