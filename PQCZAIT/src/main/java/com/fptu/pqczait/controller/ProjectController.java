package com.fptu.pqczait.controller;

import com.fptu.pqczait.dto.request.ProjectRequest;
import com.fptu.pqczait.dto.response.ProjectResponse;
import com.fptu.pqczait.entity.Project;
import com.fptu.pqczait.response.ResponseData;
import com.fptu.pqczait.service.ProjectService;
import com.fptu.pqczait.util.ResponseEntityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/projects")
    public ResponseEntity<ResponseData< List<ProjectResponse>>> getList(@RequestParam(required = false) String keyword) {
        List<ProjectResponse> list= projectService.findByName(keyword);
        return ResponseEntityUtils.success("Lấy danh sách thành công", list);
    }

    @PostMapping("/projects")
    public ResponseEntity<?> addProject(@Valid @RequestBody ProjectRequest projectRequest) {
        ProjectResponse result = projectService.add(projectRequest);
        return ResponseEntityUtils.success("Thêm mới dự án thành công", result);
    }


    @GetMapping("/projects/{id}")
    public ResponseEntity<?> editProject(@PathVariable Integer id) {
        ProjectResponse result = projectService.getProjectById(id);
        return ResponseEntityUtils.success("Lấy thông tin thành công", result);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Integer id, @RequestBody ProjectRequest projectRequest) {
        ProjectResponse result = projectService.update(id,projectRequest);
        return ResponseEntityUtils.success("Cập nhật dự án thành công", result);
    }

    // 4. Xóa dự án theo ID truyền trên đường dẫn (ví dụ: /admin/projects/5)
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        try{
            projectService.deleteProject(id);
            return ResponseEntityUtils.success("Xóa dự án thành công",null);
        } catch (Exception e) {
            return ResponseEntityUtils.error("Xóa dự án thất bại",null, HttpStatus.BAD_REQUEST);
        }

    }
}