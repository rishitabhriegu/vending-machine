package com.vendingmachine.coffee_machine.controller;

import com.vendingmachine.coffee_machine.config.JwtUtil;
import com.vendingmachine.coffee_machine.dto.AuthRequest;
import com.vendingmachine.coffee_machine.dto.AuthResponse;
import com.vendingmachine.coffee_machine.model.Role;
import com.vendingmachine.coffee_machine.model.User;
import com.vendingmachine.coffee_machine.repository.UserRepository;
import com.vendingmachine.coffee_machine.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
           @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody AuthRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

}
