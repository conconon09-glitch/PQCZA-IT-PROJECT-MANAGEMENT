package com.fptu.pqczait.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entry_field_values",
        uniqueConstraints = @UniqueConstraint(columnNames = {"entry_id", "field_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class EntryFieldValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private ProjectEntry entry;

    @ManyToOne
    @JoinColumn(name = "field_id", nullable = false)
    private SectionField field;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String value;
}