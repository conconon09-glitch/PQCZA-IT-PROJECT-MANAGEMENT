package com.fptu.pqczait.service;

import com.fptu.pqczait.dto.request.TaskRequest;
import com.fptu.pqczait.dto.response.TaskResponse;
import com.fptu.pqczait.entity.Project;
import com.fptu.pqczait.entity.ProjectStatus;
import com.fptu.pqczait.entity.Task;
import com.fptu.pqczait.repository.ProjectRepository;
import com.fptu.pqczait.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository    taskRepository;
    private final ProjectRepository projectRepository;

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án ID: " + projectId));
    }

    private TaskResponse toResponse(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getProject().getId(),
                t.getProject().getName(),
                t.getTitle(),
                t.getAssignedDate(),
                t.getDueDate(),
                t.getStatus()
        );
    }

    public List<TaskResponse> getAll() {
        return taskRepository.findAllByOrderByDueDateAsc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getByProject(Integer projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse create(TaskRequest req) {
        Task t = new Task();
        t.setProject(getProject(req.getProjectId()));
        t.setTitle(req.getTitle());
        t.setAssignedDate(req.getAssignedDate());
        t.setDueDate(req.getDueDate());
        t.setStatus(req.getStatus() != null ? req.getStatus() : ProjectStatus.PENDING);
        return toResponse(taskRepository.save(t));
    }

    public TaskResponse update(Integer id, TaskRequest req) {
        Task t = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task ID: " + id));
        if (req.getProjectId() != null) t.setProject(getProject(req.getProjectId()));
        if (req.getTitle()     != null) t.setTitle(req.getTitle());
        if (req.getAssignedDate() != null) t.setAssignedDate(req.getAssignedDate());
        if (req.getDueDate()   != null) t.setDueDate(req.getDueDate());
        if (req.getStatus()    != null) t.setStatus(req.getStatus());
        return toResponse(taskRepository.save(t));
    }

    public void delete(Integer id) {
        if (!taskRepository.existsById(id))
            throw new RuntimeException("Không tìm thấy task ID: " + id);
        taskRepository.deleteById(id);
    }
}
