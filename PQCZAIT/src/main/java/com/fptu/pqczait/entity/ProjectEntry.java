package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_entries")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProjectEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private ProjectSection section;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "entry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntryFieldValue> fieldValues = new ArrayList<>();
}