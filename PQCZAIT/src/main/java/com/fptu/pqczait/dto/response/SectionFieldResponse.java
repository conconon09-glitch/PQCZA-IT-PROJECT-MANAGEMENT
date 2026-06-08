package com.fptu.pqczait.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SectionFieldResponse {
    private Integer id;
    private String fieldKey;
    private String label;
    private String fieldType;
    private String options;
    private Integer sortOrder;
}