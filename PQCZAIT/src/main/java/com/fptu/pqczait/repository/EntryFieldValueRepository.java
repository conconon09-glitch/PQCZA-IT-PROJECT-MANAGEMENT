package com.fptu.pqczait.repository;

import com.fptu.pqczait.entity.EntryFieldValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface EntryFieldValueRepository extends JpaRepository<EntryFieldValue, Integer> {
    List<EntryFieldValue> findByEntryId(Integer entryId);

    @Transactional
    void deleteByEntryId(Integer entryId);

    @Transactional
    void deleteByFieldId(Integer fieldId);
}