package com.vendingmachine.coffee_machine.service;

import com.vendingmachine.coffee_machine.config.JwtUtil;
import com.vendingmachine.coffee_machine.dto.AuthRequest;
import com.vendingmachine.coffee_machine.dto.AuthResponse;
import com.vendingmachine.coffee_machine.exception.UserAlreadyExistsException;
import com.vendingmachine.coffee_machine.exception.UserNotFoundException;
import com.vendingmachine.coffee_machine.model.Role;
import com.vendingmachine.coffee_machine.model.User;
import com.vendingmachine.coffee_machine.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    //LOGIN
    public AuthResponse login(AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(token, user.getRole());
    }

    //REGISTER
    public String register(AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER); // default role

        userRepository.save(user);

        return "User registered successfully";
    }

}
