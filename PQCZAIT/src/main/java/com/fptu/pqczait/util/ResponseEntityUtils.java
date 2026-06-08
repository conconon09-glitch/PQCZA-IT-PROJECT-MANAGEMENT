package com.fptu.pqczait.util;

import com.fptu.pqczait.response.ResponseData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseEntityUtils {

    // 1. Phương thức thành công (Mặc định HttpStatus = 200 OK)
    public static <T> ResponseEntity<ResponseData<T>> success(String message, T data) {
        ResponseData<T> response = new ResponseData<>(true, message, data);
        return ResponseEntity.ok(response);
    }

    // 2. Phương thức thất bại (Tùy chọn truyền HttpStatus như 400 Bad Request, 404, 500...)
    public static <T> ResponseEntity<ResponseData<T>> error(String message, T errorData, HttpStatus status) {
        ResponseData<T> response = new ResponseData<>(false, message, errorData);
        return new ResponseEntity<>(response, status);
    }
}