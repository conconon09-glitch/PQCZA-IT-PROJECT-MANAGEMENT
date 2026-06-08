package com.fptu.pqczait.exception;

import com.fptu.pqczait.response.ResponseData;
import com.fptu.pqczait.util.ResponseEntityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt toàn bộ lỗi Validation (@Valid) từ RequestBody gửi lên
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseData<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();


        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntityUtils.error("Dữ liệu đầu vào không hợp lệ!", errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseData<String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntityUtils.error(ex.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}