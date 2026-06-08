package com.fptu.pqczait.service;

import com.fptu.pqczait.dto.request.EntryRequest;
import com.fptu.pqczait.dto.request.SectionFieldRequest;
import com.fptu.pqczait.dto.request.SectionRequest;
import com.fptu.pqczait.dto.response.EntryResponse;
import com.fptu.pqczait.dto.response.SectionFieldResponse;
import com.fptu.pqczait.dto.response.SectionResponse;
import com.fptu.pqczait.entity.*;
import com.fptu.pqczait.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectSectionService {

    private final ProjectRepository         projectRepository;
    private final ProjectSectionRepository  sectionRepository;
    private final SectionFieldRepository    fieldRepository;
    private final ProjectEntryRepository    entryRepository;
    private final EntryFieldValueRepository fieldValueRepository;

    private Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án ID: " + projectId));
    }

    private ProjectSection getSection(Integer sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy section ID: " + sectionId));
    }

    private SectionFieldResponse toFieldResponse(SectionField f) {
        return new SectionFieldResponse(f.getId(), f.getFieldKey(), f.getLabel(),
                f.getFieldType(), f.getOptions(), f.getSortOrder());
    }

    private SectionResponse toSectionResponse(ProjectSection s) {
        List<SectionFieldResponse> fields = fieldRepository
                .findBySectionIdOrderBySortOrder(s.getId())
                .stream().map(this::toFieldResponse).collect(Collectors.toList());
        return new SectionResponse(s.getId(), s.getName(), s.getIcon(),
                s.getColor(), s.getSortOrder(), fields);
    }

    private EntryResponse toEntryResponse(ProjectEntry e) {
        Map<String, String> values = new LinkedHashMap<>();
        e.getFieldValues().forEach(fv -> values.put(fv.getField().getFieldKey(), fv.getValue()));
        return new EntryResponse(e.getId(), e.getSection().getId(),
                e.getCreatedAt(), e.getUpdatedAt(), values);
    }

    public List<SectionResponse> getSections(Integer projectId) {
        return sectionRepository.findByProjectIdOrderBySortOrder(projectId)
                .stream().map(this::toSectionResponse).collect(Collectors.toList());
    }

    @Transactional
    public SectionResponse createSection(Integer projectId, SectionRequest req) {
        ProjectSection s = new ProjectSection();
        s.setProject(getProject(projectId));
        s.setName(req.getName());
        s.setIcon(req.getIcon()      != null ? req.getIcon()      : "bi-table");
        s.setColor(req.getColor()    != null ? req.getColor()     : "#6366f1");
        s.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        sectionRepository.save(s);
        if (req.getFields() != null) saveFields(s, req.getFields());
        return toSectionResponse(s);
    }

    @Transactional
    public SectionResponse updateSection(Integer sectionId, SectionRequest req) {
        ProjectSection s = getSection(sectionId);
        s.setName(req.getName());
        if (req.getIcon()      != null) s.setIcon(req.getIcon());
        if (req.getColor()     != null) s.setColor(req.getColor());
        if (req.getSortOrder() != null) s.setSortOrder(req.getSortOrder());
        sectionRepository.save(s);
        if (req.getFields() != null) {
            fieldRepository.deleteBySectionId(sectionId);
            saveFields(s, req.getFields());
        }
        return toSectionResponse(s);
    }

    @Transactional
    public void deleteSection(Integer sectionId) {
        entryRepository.findBySectionIdOrderByCreatedAtDesc(sectionId)
                .forEach(e -> fieldValueRepository.deleteByEntryId(e.getId()));
        entryRepository.deleteBySectionId(sectionId);
        fieldRepository.deleteBySectionId(sectionId);
        sectionRepository.deleteById(sectionId);
    }

    private void saveFields(ProjectSection section, List<SectionFieldRequest> reqs) {
        for (int i = 0; i < reqs.size(); i++) {
            SectionFieldRequest fr = reqs.get(i);
            SectionField f = new SectionField();
            f.setSection(section);
            f.setFieldKey(fr.getFieldKey());
            f.setLabel(fr.getLabel());
            f.setFieldType(fr.getFieldType());
            f.setOptions(fr.getOptions());
            f.setSortOrder(fr.getSortOrder() != null ? fr.getSortOrder() : i);
            fieldRepository.save(f);
        }
    }

    public SectionFieldResponse addField(Integer sectionId, SectionFieldRequest req) {
        SectionField f = new SectionField();
        f.setSection(getSection(sectionId));
        f.setFieldKey(req.getFieldKey());
        f.setLabel(req.getLabel());
        f.setFieldType(req.getFieldType());
        f.setOptions(req.getOptions());
        f.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        return toFieldResponse(fieldRepository.save(f));
    }

    public SectionFieldResponse updateField(Integer fieldId, SectionFieldRequest req) {
        SectionField f = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy field ID: " + fieldId));
        if (req.getLabel()     != null) f.setLabel(req.getLabel());
        if (req.getFieldType() != null) f.setFieldType(req.getFieldType());
        if (req.getOptions()   != null) f.setOptions(req.getOptions());
        if (req.getSortOrder() != null) f.setSortOrder(req.getSortOrder());
        return toFieldResponse(fieldRepository.save(f));
    }

    @Transactional
    public void deleteField(Integer fieldId) {
        fieldValueRepository.deleteByFieldId(fieldId);
        fieldRepository.deleteById(fieldId);
    }

    public List<EntryResponse> getEntries(Integer sectionId) {
        return entryRepository.findBySectionIdOrderByCreatedAtDesc(sectionId)
                .stream().map(this::toEntryResponse).collect(Collectors.toList());
    }

    @Transactional
    public EntryResponse createEntry(Integer sectionId, EntryRequest req) {
        ProjectEntry e = new ProjectEntry();
        e.setSection(getSection(sectionId));
        e.setCreatedAt(LocalDateTime.now());
        e.setUpdatedAt(LocalDateTime.now());
        entryRepository.save(e);
        saveFieldValues(e, req.getValues());
        return toEntryResponse(entryRepository.findById(e.getId()).orElse(e));
    }

    @Transactional
    public EntryResponse updateEntry(Integer entryId, EntryRequest req) {
        ProjectEntry e = entryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy entry ID: " + entryId));
        e.setUpdatedAt(LocalDateTime.now());
        entryRepository.save(e);
        fieldValueRepository.deleteByEntryId(entryId);
        saveFieldValues(e, req.getValues());
        return toEntryResponse(entryRepository.findById(entryId).orElse(e));
    }

    @Transactional
    public void deleteEntry(Integer entryId) {
        fieldValueRepository.deleteByEntryId(entryId);
        entryRepository.deleteById(entryId);
    }

    private void saveFieldValues(ProjectEntry entry, Map<Integer, String> values) {
        if (values == null) return;
        values.forEach((fieldId, value) -> {
            SectionField field = fieldRepository.findById(fieldId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy field ID: " + fieldId));
            EntryFieldValue fv = new EntryFieldValue();
            fv.setEntry(entry);
            fv.setField(field);
            fv.setValue(value);
            fieldValueRepository.save(fv);
        });
    }

    @Transactional
    public void seedDefaultSections(Integer projectId) {
        if (!sectionRepository.findByProjectIdOrderBySortOrder(projectId).isEmpty()) return;
        Project project = getProject(projectId);

        createSeedSection(project, "Ghi chú",           "bi-journal-text",   "#f59e0b", 0,
                new String[][]{{"content","Nội dung","textarea",null}});

        // SỬA LẠI ĐOẠN NÀY TRONG FILE ProjectSectionService.java:
        createSeedSection(project, "Công việc",          "bi-list-check",     "#10b981", 1,
                new String[][]{
                        {"title",       "Tên công việc",               "text",     null},
                        {"description", "Mô tả",                       "textarea", null},
                        {"status",      "Trạng thái",                  "select",   "[\"PENDING\",\"IN_PROGRESS\",\"COMPLETED\",\"CANCELLED\"]"},
                        {"startday",    "Ngày giao việc",              "date",     null}, // Đổi assigned_date thành startday
                        {"deadline",    "Thời gian dự kiến hoàn thành", "date",     null}  // Đổi due_date thành deadline
                });

        createSeedSection(project, "Quy trình",          "bi-diagram-3-fill", "#3b82f6", 2,
                new String[][]{
                        {"stepOrder",   "Thứ tự",  "number",  null},
                        {"title",       "Tên bước","text",     null},
                        {"description", "Mô tả",   "textarea", null}
                });

        createSeedSection(project, "Version",            "bi-tag-fill",       "#8b5cf6", 3,
                new String[][]{
                        {"version",     "Version",        "text",    null},
                        {"releaseDate", "Ngày phát hành", "date",    null},
                        {"changelog",   "Changelog",      "textarea",null}
                });

        createSeedSection(project, "Hướng dẫn sử dụng", "bi-book-fill",      "#14b8a6", 4,
                new String[][]{
                        {"title",  "Tiêu đề", "text",     null},
                        {"content","Nội dung","textarea",  null}
                });
    }

    private void createSeedSection(Project project, String name, String icon,
                                   String color, int order, String[][] fields) {
        ProjectSection s = new ProjectSection();
        s.setProject(project);
        s.setName(name);
        s.setIcon(icon);
        s.setColor(color);
        s.setSortOrder(order);
        sectionRepository.save(s);
        for (int i = 0; i < fields.length; i++) {
            SectionField f = new SectionField();
            f.setSection(s);
            f.setFieldKey(fields[i][0]);
            f.setLabel(fields[i][1]);
            f.setFieldType(fields[i][2]);
            f.setOptions(fields[i][3]);
            f.setSortOrder(i);
            fieldRepository.save(f);
        }
    }
}