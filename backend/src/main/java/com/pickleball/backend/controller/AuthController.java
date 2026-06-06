package com.pickleball.backend.controller;

import com.pickleball.backend.dto.AuthResponse;
import com.pickleball.backend.dto.LoginRequest;
import com.pickleball.backend.dto.RegisterRequest;
import com.pickleball.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pickleball.backend.dto.ForgotPasswordRequest;
import com.pickleball.backend.dto.ResetPasswordRequest;
import com.pickleball.backend.dto.VerifyResetPinRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/test")
public ResponseEntity<?> test() {
    return ResponseEntity.ok("AuthController đang chạy");
}

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    try {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Mã PIN đã được gửi qua email");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    authService.resetPassword(request);
    return ResponseEntity.ok("Đổi mật khẩu thành công");
}

@PostMapping("/verify-reset-pin")
public ResponseEntity<?> verifyResetPin(@RequestBody VerifyResetPinRequest request) {
    try {
        authService.verifyResetPin(request);
        return ResponseEntity.ok("Mã PIN hợp lệ");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}