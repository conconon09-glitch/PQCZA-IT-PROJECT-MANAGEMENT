package com.fptu.pqczait.repository;

import com.fptu.pqczait.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findAllByOrderByDueDateAsc();
    List<Task> findByProjectId(Integer projectId);
}
