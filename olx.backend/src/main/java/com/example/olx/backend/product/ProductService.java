package com.example.olx.backend.product;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.olx.backend.exception.ProductNotFoundException;
import com.example.olx.backend.product.dto.ProductResponseDTO;
import com.example.olx.backend.user.UserModel;
import com.example.olx.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository repository;
    private final UserRepository userRepository;
    private final ProductDTOAssembler productDTOAssembler;
    private final Cloudinary cloudinary;
    private final PagedResourcesAssembler<ProductModel> pagedResourcesAssembler;

    public ProductResponseDTO saveProduct(String username, String productName, String productType, long price, String description, MultipartFile imageFile) throws IOException {
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Upload to Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Save Product
        ProductModel product = new ProductModel();
        product.setUser(user);
        product.setProductName(productName);
        product.setProductType(productType);
        product.setPrice(price);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setCloudinaryPublicId(publicId);
        product.setUploadedAt(LocalDateTime.now());
        ProductModel saved = repository.save(product);
        return new ProductResponseDTO(
                saved.getProductId(),
                saved.getProductName(),
                saved.getProductType(),
                saved.getPrice(),
                saved.getImageUrl(), // 🔁 now string
                saved.getDescription(),
                saved.getUser().getEmail()
        );
    }


    @Transactional
    public String deleteProduct(String username, UUID id) {
        ProductModel product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (!product.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Not your product");
        }

        try {
            String publicId = product.getCloudinaryPublicId();
            if (publicId != null && !publicId.isEmpty()) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary", e);
        }

        repository.delete(product);
        return "delete successfully";
    }


    public EntityModel<ProductResponseDTO> getProduct(UUID id) {
        ProductModel product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        return productDTOAssembler.toModel(product); //  Direct model
    }


    // ( sec min hr DayOfMonth Month DayOdWeek )
    @Scheduled(cron = "0 0 2 * * *",zone = "Asia/Delhi")
    @Transactional
    public void deleteExpiredProducts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        List<ProductModel> oldProducts = repository.findByUploadedAtBefore(oneWeekAgo);

        for (ProductModel product : oldProducts) {
            try {
                String publicId = product.getCloudinaryPublicId();
                if (publicId != null && !publicId.isEmpty()) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    repository.delete(product);
                    log.info("Deleted product and image: " + publicId);
                }
            } catch (Exception e) {
                log.error("Failed to delete image for productId: " + product.getProductId(), e);
            }
        }
    }



    public PagedModel<EntityModel<ProductResponseDTO>> getAllProducts(int page, int size, String sortBy, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductModel> productPage;

        if (search != null && !search.isBlank()) {
            productPage = repository.findByProductNameContainingIgnoreCase(search, pageable);
        } else {
            productPage = repository.findAll(pageable);
        }

        return pagedResourcesAssembler.toModel(productPage, productDTOAssembler);
    }

    public PagedModel<EntityModel<ProductResponseDTO>> searchProducts(String keyword, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductModel> results = repository.findByProductNameContainingIgnoreCase(keyword, pageable);
        return pagedResourcesAssembler.toModel(results, productDTOAssembler);
    }


}
