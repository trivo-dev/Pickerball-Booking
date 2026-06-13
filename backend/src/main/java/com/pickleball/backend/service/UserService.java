package com.pickleball.backend.service;

import com.pickleball.backend.dto.CreateUserRequest;
import com.pickleball.backend.dto.UpdateUserRequest;
import com.pickleball.backend.dto.UpdateUserRoleRequest;
import com.pickleball.backend.dto.UserResponse;
import com.pickleball.backend.entity.User;
import com.pickleball.backend.enums.Role;
import com.pickleball.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse createUser(CreateUserRequest request) {
        validateCreateUser(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        Role role = parseRole(request.getRole());

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        validateUpdateUser(request);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        userRepository.findByEmail(request.getEmail())
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        throw new RuntimeException("Email đã tồn tại");
                    }
                });

        Role role = parseRole(request.getRole());

        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim());
        user.setPhone(request.getPhone());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    public UserResponse updateUserRole(Long id, UpdateUserRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Role newRole = parseRole(request.getRole());
        user.setRole(newRole);

        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }

        userRepository.deleteById(id);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name()
        );
    }

    private Role parseRole(String role) {
        try {
            if (role == null || role.trim().isEmpty()) {
                return Role.USER;
            }

            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role không hợp lệ");
        }
    }

    private void validateCreateUser(CreateUserRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email không được để trống");
        }

        if (!request.getEmail().contains("@")) {
            throw new RuntimeException("Email không hợp lệ");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Mật khẩu không được để trống");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 6 ký tự");
        }
    }

    private void validateUpdateUser(UpdateUserRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email không được để trống");
        }

        if (!request.getEmail().contains("@")) {
            throw new RuntimeException("Email không hợp lệ");
        }
    }
}