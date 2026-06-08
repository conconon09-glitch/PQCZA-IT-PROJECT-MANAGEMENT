package com.fptu.pqczait.mapper;

import com.fptu.pqczait.dto.response.ProjectResponse;
import com.fptu.pqczait.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {
    public ProjectResponse toDTO(Project project) {
        if (project == null) return null;

        ProjectResponse res = new ProjectResponse();
        res.setId(project.getId());
        res.setName(project.getName());
        res.setDescription(project.getDescription());

        res.setStatus(project.getStatus());
        return res;
    }
}