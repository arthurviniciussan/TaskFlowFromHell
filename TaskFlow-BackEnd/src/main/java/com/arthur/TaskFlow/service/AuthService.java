package com.arthur.TaskFlow.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.arthur.TaskFlow.DTOs.userDTO.AuthResponseDTO;
import com.arthur.TaskFlow.DTOs.userDTO.LoginRequestDTO;
import com.arthur.TaskFlow.DTOs.userDTO.RegisterRequestDTO;
import com.arthur.TaskFlow.Infra.security.TokenService;
import com.arthur.TaskFlow.entity.User;
import com.arthur.TaskFlow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthResponseDTO login(LoginRequestDTO body) {
        User user = this.userRepository.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!this.passwordEncoder.matches(body.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = this.tokenService.generateToken(user);
        return new AuthResponseDTO(user.getUsername(), token);
    }

    public AuthResponseDTO register(RegisterRequestDTO body) {
        Optional<User> existingUser = this.userRepository.findByEmail(body.email());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setUsername(body.username());
        user.setEmail(body.email());
        user.setPassword(this.passwordEncoder.encode(body.password()));
        User savedUser = this.userRepository.save(user);
        String token = this.tokenService.generateToken(savedUser);
        return new AuthResponseDTO(savedUser.getUsername(), token);
    }



}
