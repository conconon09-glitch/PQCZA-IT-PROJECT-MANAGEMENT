package com.fptu.pqczait.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResponseData<T> {
    private boolean status;
    private String message;
    private T data;
}