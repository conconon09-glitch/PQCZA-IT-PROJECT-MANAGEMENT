package com.fptu.pqczait.dto.response;

import com.fptu.pqczait.entity.ProjectStatus;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProjectResponse {

    private Integer id;
    private String name;
    private String description;
    private String assignedBy;
    private String assignedTo;
    private LocalDate deadline;
    private ProjectStatus status;
}