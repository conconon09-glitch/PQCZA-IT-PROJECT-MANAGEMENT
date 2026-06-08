package com.fptu.pqczait.service;

import com.fptu.pqczait.dto.request.ProjectRequest;
import com.fptu.pqczait.dto.response.ProjectResponse;
import com.fptu.pqczait.entity.Project;
import com.fptu.pqczait.entity.ProjectSection;
import com.fptu.pqczait.entity.ProjectStatus;
import com.fptu.pqczait.mapper.ProjectMapper;
import com.fptu.pqczait.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository         projectRepository;
    private final ProjectMapper             projectMapper;
    private final ProjectSectionRepository  sectionRepository;
    private final SectionFieldRepository    fieldRepository;
    private final ProjectEntryRepository    entryRepository;
    private final EntryFieldValueRepository fieldValueRepository;

    public Project save(Project project) { return projectRepository.save(project); }
    public Project findById(Integer id)  { return projectRepository.findById(id).orElse(null); }
    public ProjectResponse getProjectById(Integer id) { return projectMapper.toDTO(findById(id)); }
    public List<Project> findAll() { return projectRepository.findAll(); }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toDTO).collect(Collectors.toList());
    }

    public List<ProjectResponse> findByName(String keyword) {
        return projectRepository.findByName(keyword).stream()
                .map(projectMapper::toDTO).collect(Collectors.toList());
    }

    public ProjectResponse add(ProjectRequest req) {
        Project p = new Project();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setStatus(req.getStatus() != null ? req.getStatus() : ProjectStatus.PENDING);
        return projectMapper.toDTO(save(p));
    }

    public ProjectResponse update(Integer id, ProjectRequest req) {
        Project p = findById(id);
        if (p == null) throw new RuntimeException("Không tìm thấy dự án ID: " + id);
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        return projectMapper.toDTO(save(p));
    }

    @Transactional
    public void deleteProject(Integer id) {
        if (!projectRepository.existsById(id))
            throw new RuntimeException("Không tìm thấy dự án ID: " + id);
        List<ProjectSection> sections = sectionRepository.findByProjectIdOrderBySortOrder(id);
        for (ProjectSection s : sections) {
            entryRepository.findBySectionIdOrderByCreatedAtDesc(s.getId())
                    .forEach(e -> fieldValueRepository.deleteByEntryId(e.getId()));
            entryRepository.deleteBySectionId(s.getId());
            fieldRepository.deleteBySectionId(s.getId());
        }
        sectionRepository.deleteAll(sections);
        projectRepository.deleteById(id);
    }

    public void insertData() {
        if (projectRepository.count() > 0) return;
        projectRepository.saveAll(Arrays.asList(
                new Project(null, "PQCZAIT-E-COMMERCE-PLATFORM",   "Hệ thống thương mại điện tử tích hợp ví điện tử.", ProjectStatus.IN_PROGRESS),
                new Project(null, "SMART-INVENTORY-MANAGEMENT",    "Hệ thống quản lý kho thông minh sử dụng AI.",      ProjectStatus.PENDING),
                new Project(null, "FINTECH-MICRO-PAYMENT-GATEWAY", "Cổng thanh toán bảo mật cao cho micro-transactions.", ProjectStatus.COMPLETED),
                new Project(null, "PERSONAL-FINANCE-TRACKER",      "Ứng dụng di động quản lý tài chính cá nhân.",      ProjectStatus.CANCELLED),
                new Project(null, "TELEHEALTH-CLINIC-SYSTEM",      "Nền tảng khám bệnh và quản lý hồ sơ y tế từ xa.", ProjectStatus.PENDING),
                new Project(null, "E-LEARNING-GAMIFICATION",       "Hệ thống học trực tuyến ứng dụng trò chơi hóa.",  ProjectStatus.IN_PROGRESS),
                new Project(null, "PQCZA-INTERNAL-TASK-TRACKER",   "Công cụ quản lý công việc theo mô hình Agile.",   ProjectStatus.COMPLETED),
                new Project(null, "SMART-HRM-LEAVE-PORTAL",        "Hệ thống quản lý nhân sự và chấm công tự động.",  ProjectStatus.PENDING),
                new Project(null, "CUSTOMER-SUPPORT-AI-CHATBOT",   "Chatbot chăm sóc khách hàng tự động tích hợp AI.", ProjectStatus.IN_PROGRESS),
                new Project(null, "IOT-SMART-OFFICE-AUTOMATION",   "Hệ thống tự động hóa văn phòng qua thiết bị IoT.", ProjectStatus.PENDING)
        ));
    }
}