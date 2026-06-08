package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String title;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.PENDING;
}
