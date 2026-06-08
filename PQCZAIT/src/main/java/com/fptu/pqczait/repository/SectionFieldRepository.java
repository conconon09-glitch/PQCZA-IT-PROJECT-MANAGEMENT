package com.fptu.pqczait.repository;

import com.fptu.pqczait.entity.SectionField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface SectionFieldRepository extends JpaRepository<SectionField, Integer> {
    List<SectionField> findBySectionIdOrderBySortOrder(Integer sectionId);

    @Transactional
    void deleteBySectionId(Integer sectionId);
}