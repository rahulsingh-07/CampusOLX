package com.example.olx.backend.product;

import com.example.olx.backend.product.dto.ProductResponseDTO;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ProductDTOAssembler implements RepresentationModelAssembler<ProductModel, EntityModel<ProductResponseDTO>> {

    @Override
    public EntityModel<ProductResponseDTO> toModel(ProductModel product) {
        ProductResponseDTO dto = new ProductResponseDTO(
                product.getProductId(),
                product.getProductName(),
                product.getProductType(),
                product.getPrice(),
                product.getImageUrl(),
                product.getDescription(),
                product.getUser().getEmail()
        );

        return EntityModel.of(dto,
                linkTo(methodOn(ProductController.class).getProductById(dto.getProductId())).withSelfRel()
//                linkTo(methodOn(ProductController.class).getAllProducts(0, 6, "productName")).withRel("all-products")
        );
    }
}
