package com.shopease.ecommerce.service;

import com.shopease.ecommerce.dto.AuthResponse;
import com.shopease.ecommerce.dto.LoginRequest;
import com.shopease.ecommerce.dto.RegisterRequest;
import com.shopease.ecommerce.entity.AuthProvider;
import com.shopease.ecommerce.entity.Role;
import com.shopease.ecommerce.entity.User;
import com.shopease.ecommerce.repository.UserRepository;
import com.shopease.ecommerce.security.JwtService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        private final JwtService jwtService;
        private final UserRepository userRepository;

        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        public AuthService(
                        UserRepository userRepository,
                        JwtService jwtService) {

                this.userRepository = userRepository;
                this.jwtService = jwtService;
        }

        /*
         * REGISTER
         */

        public AuthResponse register(RegisterRequest request) {

                // Check whether email already exists
                if (userRepository.existsByEmail(request.getEmail())) {

                        throw new RuntimeException(
                                        "An account with this email already exists");
                }

                // Create new user
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(
                                                passwordEncoder.encode(
                                                                request.getPassword()))
                                .provider(AuthProvider.LOCAL)
                                .role(Role.CUSTOMER)
                                .build();

                // Save user to database
                User savedUser = userRepository.save(user);

                // Generate JWT token
                String token = jwtService.generateToken(
                                savedUser.getId(),
                                savedUser.getEmail());

                // Return registration response
                return new AuthResponse(
                                savedUser.getId(),
                                savedUser.getName(),
                                savedUser.getEmail(),
                                "Registration successful",
                                token);
        }

        /*
         * LOGIN
         */

        public AuthResponse login(LoginRequest request) {

                // Find user by email
                User user = userRepository
                                .findByEmail(request.getEmail())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Invalid email or password"));

                // Verify password
                boolean passwordMatches = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword());

                if (!passwordMatches) {

                        throw new RuntimeException(
                                        "Invalid email or password");
                }

                // Generate JWT token
                String token = jwtService.generateToken(
                                user.getId(),
                                user.getEmail());

                // Login successful
                return new AuthResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                "Login successful",
                                token);
        }
}