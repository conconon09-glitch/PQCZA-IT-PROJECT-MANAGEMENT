package com.fptu.pqczait.service;

import com.fptu.pqczait.dto.request.LoginRequest;
import com.fptu.pqczait.dto.response.LoginResponse;
import com.fptu.pqczait.entity.User;
import com.fptu.pqczait.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        // So sánh password trực tiếp (plain text, chưa mã hóa)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        return new LoginResponse(user.getId(), user.getUsername(), user.getRole());
    }

    // Tạo tài khoản admin mặc định nếu chưa có
    public void insertDefaultUser() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    new User(null, "admin", "admin123", "ADMIN"),
                    new User(null, "user1", "user123",  "USER")
            ));
        }
    }
}
