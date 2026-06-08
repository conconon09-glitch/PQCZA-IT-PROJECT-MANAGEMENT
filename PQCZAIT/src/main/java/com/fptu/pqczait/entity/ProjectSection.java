package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_sections")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProjectSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "NVARCHAR(100)", nullable = false)
    private String name;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String icon;

    @Column(columnDefinition = "NVARCHAR(20)")
    private String color;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<SectionField> fields = new ArrayList<>();
}