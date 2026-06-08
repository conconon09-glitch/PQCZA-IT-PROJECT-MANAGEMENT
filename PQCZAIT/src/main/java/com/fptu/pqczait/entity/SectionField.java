package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section_fields")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SectionField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private ProjectSection section;

    @Column(name = "field_key", nullable = false, columnDefinition = "NVARCHAR(50)")
    private String fieldKey;

    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    private String label;

    @Column(name = "field_type", nullable = false, columnDefinition = "NVARCHAR(20)")
    private String fieldType;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String options;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}