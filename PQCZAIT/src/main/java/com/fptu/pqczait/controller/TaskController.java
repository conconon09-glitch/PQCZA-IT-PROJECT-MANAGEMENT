package com.fptu.pqczait.controller;

import com.fptu.pqczait.dto.request.TaskRequest;
import com.fptu.pqczait.service.TaskService;
import com.fptu.pqczait.util.ResponseEntityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntityUtils.success("OK", taskService.getAll());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getByProject(@PathVariable Integer projectId) {
        return ResponseEntityUtils.success("OK", taskService.getByProject(projectId));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TaskRequest req) {
        return ResponseEntityUtils.success("Tạo task thành công", taskService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
                                    @RequestBody TaskRequest req) {
        return ResponseEntityUtils.success("Cập nhật thành công", taskService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        taskService.delete(id);
        return ResponseEntityUtils.success("Xóa thành công", null);
    }
}
