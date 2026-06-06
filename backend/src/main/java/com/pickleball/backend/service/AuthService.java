package com.pickleball.backend.service;

import com.pickleball.backend.dto.AuthResponse;
import com.pickleball.backend.dto.LoginRequest;
import com.pickleball.backend.dto.RegisterRequest;
import com.pickleball.backend.entity.User;
import com.pickleball.backend.enums.Role;
import com.pickleball.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pickleball.backend.dto.ForgotPasswordRequest;
import com.pickleball.backend.dto.ResetPasswordRequest;
import com.pickleball.backend.dto.VerifyResetPinRequest;
import com.pickleball.backend.entity.PasswordResetToken;
import com.pickleball.backend.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole().name(),
                "Đăng ký thành công");
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        boolean isPasswordCorrect = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!isPasswordCorrect) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                "Đăng nhập thành công");
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String pin = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(user.getEmail());
        token.setPin(pin);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        token.setUsed(false);

        passwordResetTokenRepository.save(token);

        emailService.sendResetPasswordPin(user.getEmail(), pin);
    }

    // Đổi mật khẩu
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository
                .findTopByEmailAndPinAndUsedFalseOrderByIdDesc(
                        request.getEmail(),
                        request.getPin())
                .orElseThrow(() -> new RuntimeException("Ma PIN khong dung"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ma PIN da het han");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email khong ton tai"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

    public void verifyResetPin(VerifyResetPinRequest request) {
    PasswordResetToken token = passwordResetTokenRepository
            .findTopByEmailAndPinAndUsedFalseOrderByIdDesc(
                    request.getEmail(),
                    request.getPin()
            )
            .orElseThrow(() -> new RuntimeException("Mã PIN không đúng"));

    if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Mã PIN đã hết hạn");
    }
}
}