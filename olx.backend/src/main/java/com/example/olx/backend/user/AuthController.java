package com.example.olx.backend.user;

import com.example.olx.backend.exception.UserNotFoundException;
import com.example.olx.backend.user.dto.UserLoginDTO;
import com.example.olx.backend.user.dto.UserRegDTO;
import com.example.olx.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    UserModel user = new UserModel();
    public static final String MESSAGE = "message";

    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> register(@RequestBody UserRegDTO request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(MESSAGE, "username is taken"));
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(MESSAGE, "password is not same"));
        }
        if(!request.getEmail().endsWith("@nituk.ac.in")){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(MESSAGE, "login with collage email"));
        }

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        List<String> errors = getStringList(user);

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(MESSAGE, errors.get(0)));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(MESSAGE, "registered successfully"));
    }

    public static List<String> getStringList(UserModel userModel) {
        String password = userModel.getPassword();
        List<String> errors = new ArrayList<>();

        if (!password.matches(".*[a-z].*")) {
            errors.add("at least one lowercase letter required");
        }
        if (!password.matches(".*[A-Z].*")) {
            errors.add("at least one uppercase letter required");
        }
        if (!password.matches(".*\\d.*")) {
            errors.add("at least one digit required");
        }
        if (!password.matches(".*[@!#&*%].*")) {
            errors.add("at least one special character (@!#&*%) required");
        }
        if (password.length() < 6) {
            errors.add("password must be at least 6 characters long");
        }
        return errors;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody UserLoginDTO login) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword())
            );

            if (authentication.isAuthenticated()) {
                UserModel loginuser = userRepository.findByUsername(login.getUsername())
                        .orElseThrow(() -> new UserNotFoundException("User not found"));

                String jwt = jwtUtil.generateToken(loginuser.getUsername(), loginuser.getRole());

                return ResponseEntity.ok(Map.of(
                        "token", jwt,
                        MESSAGE, "Login successful"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(MESSAGE, "Authentication failed"));
            }

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(MESSAGE, "Invalid username or password"));
        }
    }
}
