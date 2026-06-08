package com.fptu.pqczait.repository;

import com.fptu.pqczait.entity.ProjectEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ProjectEntryRepository extends JpaRepository<ProjectEntry, Integer> {
    List<ProjectEntry> findBySectionIdOrderByCreatedAtDesc(Integer sectionId);

    @Transactional
    void deleteBySectionId(Integer sectionId);
}