package com.arthur.TaskFlow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arthur.TaskFlow.DTOs.userDTO.AuthResponseDTO;
import com.arthur.TaskFlow.DTOs.userDTO.LoginRequestDTO;
import com.arthur.TaskFlow.DTOs.userDTO.RegisterRequestDTO;
import com.arthur.TaskFlow.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO body) {
        AuthResponseDTO response = authService.login(body);
        if (response == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO body) {
        AuthResponseDTO response = authService.register(body);
        if (response == null) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok(response);
    }
}
