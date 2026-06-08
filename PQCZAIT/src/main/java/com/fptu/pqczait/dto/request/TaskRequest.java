package com.fptu.pqczait.dto.request;

import com.fptu.pqczait.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TaskRequest {

    @NotNull(message = "project_id không được để trống")
    private Integer projectId;

    @NotBlank(message = "Tên công việc không được để trống")
    private String title;

    private LocalDate assignedDate;
    private LocalDate dueDate;
    private ProjectStatus status;
}
