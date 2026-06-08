package com.fptu.pqczait.dto.response;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SectionResponse {
    private Integer id;
    private String name;
    private String icon;
    private String color;
    private Integer sortOrder;
    private List<SectionFieldResponse> fields;
}