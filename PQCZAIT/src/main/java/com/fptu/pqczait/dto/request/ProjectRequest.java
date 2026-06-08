package com.fptu.pqczait.dto.request;

import com.fptu.pqczait.entity.ProjectStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Tên dự án không được để trống")
    @Size(max = 255, message = "Tên dự án không được vượt quá 255 ký tự")
    private String name;

    @NotBlank(message = "Nội dung mô tả không được để trống")
    private String description;



    private ProjectStatus status; // Nếu null thì Service sẽ mặc định PENDING
}