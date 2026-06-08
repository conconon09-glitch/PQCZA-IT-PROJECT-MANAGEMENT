package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(100)")
    private String username;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String role; // ADMIN, USER,...
}
