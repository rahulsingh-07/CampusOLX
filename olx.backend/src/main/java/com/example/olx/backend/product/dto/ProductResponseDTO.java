package com.example.olx.backend.product.dto;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    private UUID productId;
    private String productName;
    private String productType;
    private long price;
    private String imageUrl;

    private String description;
    private String ownerEmail;
}
