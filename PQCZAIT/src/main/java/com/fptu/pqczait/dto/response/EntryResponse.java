package com.fptu.pqczait.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EntryResponse {
    private Integer id;
    private Integer sectionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, String> values;
}