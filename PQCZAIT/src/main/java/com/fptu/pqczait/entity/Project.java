package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String name;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String description;

    // Trạng thái: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status = ProjectStatus.PENDING;
}
