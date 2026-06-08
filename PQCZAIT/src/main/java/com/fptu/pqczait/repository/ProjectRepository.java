package com.fptu.pqczait.repository;

import com.fptu.pqczait.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Integer> {
    @Query("SELECT p FROM Project p WHERE :keyword IS NULL OR p.name LIKE %:keyword%")
    List<Project> findByName(@Param("keyword") String keyword);
}
