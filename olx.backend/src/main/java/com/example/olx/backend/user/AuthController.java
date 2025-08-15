package com.example.olx.backend.user;

import com.example.olx.backend.email.EmailService;
import com.example.olx.backend.email.OtpService;
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

import java.security.SecureRandom;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private static final SecureRandom secureRandom = new SecureRandom();
    private final OtpService otpService;
    public static final String MESSAGE = "message";


    @PostMapping("/register/request-otp")
    public ResponseEntity<Map<String, String>> requestOtp(@RequestBody UserRegDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(MESSAGE, "Username is taken"));
        }

        if (!request.getEmail().endsWith("@nituk.ac.in")) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(MESSAGE, "Use college email"));
        }

        List<String> errors = getStringList(request.getPassword());
        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of(MESSAGE, errors.get(0)));
        }
        String otp = otpService.generateOtp(request.getEmail());
        emailService.sendOtpEmail(request.getEmail(), otp);
        return ResponseEntity.ok(Map.of(MESSAGE, "OTP sent to email"));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody UserRegDTO request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(MESSAGE, "Invalid or expired OTP"));
        }
        // OTP is valid, register the user
        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("USER");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(MESSAGE, "Registered successfully"));
    }


    public static List<String> getStringList(String password) {
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
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginDTO login) {
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
