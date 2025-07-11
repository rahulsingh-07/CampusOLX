package com.example.olx.backend.product;

import com.example.olx.backend.user.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductModel {
    @Id
    @GeneratedValue
    private UUID productId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String productType;

    @Column(nullable = false)
    private long price;

    @Lob
//    @Column(nullable = false)
    private byte[] image;

    private String description;

    @ManyToOne
    @JoinColumn(name = "userid")
    private UserModel user;
}
