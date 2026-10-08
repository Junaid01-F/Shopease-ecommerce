package com.shopease.ecommerce.security;

import com.shopease.ecommerce.entity.User;
import com.shopease.ecommerce.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");


        if (
                authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        String token =
                authorizationHeader.substring(7);


        try {

            if (jwtService.isTokenValid(token)) {

                String email =
                        jwtService.extractEmail(token);


                userRepository
                        .findByEmail(email)
                        .ifPresent(user -> {

                            SimpleGrantedAuthority authority =
                                    new SimpleGrantedAuthority(
                                            "ROLE_" +
                                            user.getRole().name()
                                    );


                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            user.getEmail(),
                                            null,
                                            List.of(authority)
                                    );


                            SecurityContextHolder
                                    .getContext()
                                    .setAuthentication(
                                            authentication
                                    );
                        });
            }

        } catch (Exception error) {

            SecurityContextHolder
                    .clearContext();
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}