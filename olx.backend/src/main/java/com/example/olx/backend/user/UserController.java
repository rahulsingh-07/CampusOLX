package com.example.olx.backend.user;

import com.example.olx.backend.exception.UserNotFoundException;
import com.example.olx.backend.product.ProductModel;
import com.example.olx.backend.product.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserRepository repository;
    private final ProductRepository productRepository;
    @GetMapping("/public")
    public String greet(){
        return "hello";
    }

    @GetMapping("user/myProducts")
    public List<ProductModel> myProsucta(@AuthenticationPrincipal UserDetails user){
        String username=user.getUsername();
        UserModel u=repository.findByUsername(username).orElseThrow(()-> new UserNotFoundException("user not found"));
        UUID userid=u.getUserid();


        return productRepository.findAllByUserUserid(userid);
    }
}
