package com.shopease.ecommerce.dto;

public class AuthResponse {

    private Long userId;
    private String name;
    private String email;
    private String message;
    private String token;

    public AuthResponse(
            Long userId,
            String name,
            String email,
            String message,
            String token) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.message = message;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}