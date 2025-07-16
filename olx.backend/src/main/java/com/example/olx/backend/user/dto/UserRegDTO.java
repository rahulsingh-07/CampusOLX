package com.example.olx.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegDTO {
    private String username;
    private String email;
    private String password;
}
