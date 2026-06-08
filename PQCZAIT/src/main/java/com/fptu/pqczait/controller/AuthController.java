package com.fptu.pqczait.controller;

import com.fptu.pqczait.dto.request.LoginRequest;
import com.fptu.pqczait.dto.response.LoginResponse;
import com.fptu.pqczait.response.ResponseData;
import com.fptu.pqczait.service.UserService;
import com.fptu.pqczait.util.ResponseEntityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse result = userService.login(loginRequest);
            return ResponseEntityUtils.success("Đăng nhập thành công", result);
        } catch (RuntimeException e) {
            return ResponseEntityUtils.error(e.getMessage(), null, HttpStatus.UNAUTHORIZED);
        }
    }
}
