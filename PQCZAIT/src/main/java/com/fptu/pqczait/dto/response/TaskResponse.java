package com.fptu.pqczait.dto.response;

import com.fptu.pqczait.entity.ProjectStatus;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TaskResponse {
    private Integer id;
    private Integer projectId;
    private String  projectName;
    private String  title;
    private LocalDate assignedDate;
    private LocalDate dueDate;
    private ProjectStatus status;
}
