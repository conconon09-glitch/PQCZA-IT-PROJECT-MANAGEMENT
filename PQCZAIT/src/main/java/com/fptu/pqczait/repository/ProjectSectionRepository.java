package com.fptu.pqczait.repository;
import com.fptu.pqczait.entity.ProjectSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectSectionRepository extends JpaRepository<ProjectSection, Integer> {
    List<ProjectSection> findByProjectIdOrderBySortOrder(Integer projectId);
}