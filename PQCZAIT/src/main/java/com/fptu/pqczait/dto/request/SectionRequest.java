package com.fptu.pqczait.dto.request;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SectionRequest {
    private String name;
    private String icon;
    private String color;
    private Integer sortOrder;
    private List<SectionFieldRequest> fields;
}