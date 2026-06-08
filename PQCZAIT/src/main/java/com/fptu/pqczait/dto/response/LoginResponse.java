package com.fptu.pqczait.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LoginResponse {
    private Integer id;
    private String username;
    private String role;
}
