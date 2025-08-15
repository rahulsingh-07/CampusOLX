package com.example.olx.backend.product;

import com.example.olx.backend.product.dto.ProductResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @PostMapping("/user/saveProduct")
    public ProductResponseDTO saveProduct(
            @RequestParam("username") String username,
            @RequestParam("productName") String productName,
            @RequestParam("productType") String productType,
            @RequestParam("price") long price,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        return service.saveProduct(username, productName, productType, price, description, image);
    }


    @DeleteMapping("/user/deleteProduct/{id}")
    public ResponseEntity<String> deleteProduct(@AuthenticationPrincipal UserDetails user,@PathVariable UUID id){
        String username=user.getUsername();
        return ResponseEntity.ok(service.deleteProduct(username,id));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<EntityModel<ProductResponseDTO>> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getProduct(id));
    }

    @GetMapping("/public/all")
    public ResponseEntity<PagedModel<EntityModel<ProductResponseDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(service.getAllProducts(page, size, sortBy, search));
    }

    @GetMapping("/public/search")
    public ResponseEntity<PagedModel<EntityModel<ProductResponseDTO>>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {
        return ResponseEntity.ok(service.searchProducts(q, page, size, sortBy));
    }



}
