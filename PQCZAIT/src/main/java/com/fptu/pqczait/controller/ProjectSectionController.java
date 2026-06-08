package com.fptu.pqczait.controller;

import com.fptu.pqczait.dto.request.EntryRequest;
import com.fptu.pqczait.dto.request.SectionFieldRequest;
import com.fptu.pqczait.dto.request.SectionRequest;
import com.fptu.pqczait.service.ProjectSectionService;
import com.fptu.pqczait.util.ResponseEntityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/projects/{projectId}")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectSectionController {

    private final ProjectSectionService sectionService;

    @PostMapping("/sections/seed")
    public ResponseEntity<?> seed(@PathVariable Integer projectId) {
        sectionService.seedDefaultSections(projectId);
        return ResponseEntityUtils.success("Seed thành công", null);
    }

    @GetMapping("/sections")
    public ResponseEntity<?> getSections(@PathVariable Integer projectId) {
        return ResponseEntityUtils.success("OK", sectionService.getSections(projectId));
    }

    @PostMapping("/sections")
    public ResponseEntity<?> createSection(@PathVariable Integer projectId,
                                           @RequestBody SectionRequest req) {
        return ResponseEntityUtils.success("Tạo bảng thành công",
                sectionService.createSection(projectId, req));
    }

    @PutMapping("/sections/{sectionId}")
    public ResponseEntity<?> updateSection(@PathVariable Integer projectId,
                                           @PathVariable Integer sectionId,
                                           @RequestBody SectionRequest req) {
        return ResponseEntityUtils.success("Cập nhật thành công",
                sectionService.updateSection(sectionId, req));
    }

    @DeleteMapping("/sections/{sectionId}")
    public ResponseEntity<?> deleteSection(@PathVariable Integer projectId,
                                           @PathVariable Integer sectionId) {
        sectionService.deleteSection(sectionId);
        return ResponseEntityUtils.success("Xóa bảng thành công", null);
    }

    @PostMapping("/sections/{sectionId}/fields")
    public ResponseEntity<?> addField(@PathVariable Integer projectId,
                                      @PathVariable Integer sectionId,
                                      @RequestBody SectionFieldRequest req) {
        return ResponseEntityUtils.success("Thêm field thành công",
                sectionService.addField(sectionId, req));
    }

    @PutMapping("/sections/{sectionId}/fields/{fieldId}")
    public ResponseEntity<?> updateField(@PathVariable Integer projectId,
                                         @PathVariable Integer sectionId,
                                         @PathVariable Integer fieldId,
                                         @RequestBody SectionFieldRequest req) {
        return ResponseEntityUtils.success("Cập nhật field thành công",
                sectionService.updateField(fieldId, req));
    }

    @DeleteMapping("/sections/{sectionId}/fields/{fieldId}")
    public ResponseEntity<?> deleteField(@PathVariable Integer projectId,
                                         @PathVariable Integer sectionId,
                                         @PathVariable Integer fieldId) {
        sectionService.deleteField(fieldId);
        return ResponseEntityUtils.success("Xóa field thành công", null);
    }

    @GetMapping("/sections/{sectionId}/entries")
    public ResponseEntity<?> getEntries(@PathVariable Integer projectId,
                                        @PathVariable Integer sectionId) {
        return ResponseEntityUtils.success("OK", sectionService.getEntries(sectionId));
    }

    @PostMapping("/sections/{sectionId}/entries")
    public ResponseEntity<?> createEntry(@PathVariable Integer projectId,
                                         @PathVariable Integer sectionId,
                                         @RequestBody EntryRequest req) {
        return ResponseEntityUtils.success("Thêm thành công",
                sectionService.createEntry(sectionId, req));
    }

    @PutMapping("/sections/{sectionId}/entries/{entryId}")
    public ResponseEntity<?> updateEntry(@PathVariable Integer projectId,
                                         @PathVariable Integer sectionId,
                                         @PathVariable Integer entryId,
                                         @RequestBody EntryRequest req) {
        return ResponseEntityUtils.success("Cập nhật thành công",
                sectionService.updateEntry(entryId, req));
    }

    @DeleteMapping("/sections/{sectionId}/entries/{entryId}")
    public ResponseEntity<?> deleteEntry(@PathVariable Integer projectId,
                                         @PathVariable Integer sectionId,
                                         @PathVariable Integer entryId) {
        sectionService.deleteEntry(entryId);
        return ResponseEntityUtils.success("Xóa thành công", null);
    }
}