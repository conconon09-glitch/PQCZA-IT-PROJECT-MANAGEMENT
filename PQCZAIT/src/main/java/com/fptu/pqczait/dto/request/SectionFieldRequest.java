package com.fptu.pqczait.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SectionFieldRequest {
    private String fieldKey;
    private String label;
    private String fieldType;
    private String options;
    private Integer sortOrder;
}