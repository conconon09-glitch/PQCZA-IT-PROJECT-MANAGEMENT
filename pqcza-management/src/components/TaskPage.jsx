import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ĐƯỜNG DẪN CHUẨN XÁC CỦA HỆ THỐNG BẠN LÀ /admin/projects
const BASE_URL = 'http://localhost:8080/admin/projects';

export default function TaskPage() {
    const [projects, setProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho bộ lọc
    const [projectFilter, setProjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Gọi API lấy danh sách dự án
            const projRes = await axios.get(BASE_URL);
            const validProjects = projRes.data.data || projRes.data || [];
            setProjects(validProjects);

            let tasksArray = [];

            // 2. Quét qua từng dự án để lấy các bảng Công việc
            // Dùng Promise.all để quét song song cho tốc độ nhanh nhất
            await Promise.all(validProjects.map(async (proj) => {
                try {
                    const secRes = await axios.get(`${BASE_URL}/${proj.id}/sections`);
                    const sections = secRes.data.data || secRes.data || [];
                    
                    // Tìm Section có chứa chữ "công việc" (không phân biệt hoa thường)
                    const taskSection = sections.find(s => s.name.toLowerCase().includes('công việc'));

                    if (taskSection) {
                        // Gọi đúng đường dẫn entries của hệ thống
                        const entryRes = await axios.get(`${BASE_URL}/${proj.id}/sections/${taskSection.id}/entries`);
                        const entries = entryRes.data.data || entryRes.data || [];

                        entries.forEach(entry => {
                            tasksArray.push({
                                ...entry,
                                projectId: proj.id,
                                projectName: proj.name,
                            });
                        });
                    }
                } catch (err) {
                    console.warn(`Không thể lấy dữ liệu từ dự án ${proj.id}`, err);
                }
            }));
            
            // Sắp xếp task mới nhất lên đầu
            tasksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAllTasks(tasksArray);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Task:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm render badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="badge bg-warning text-dark px-2 py-1"><i className="bi bi-hourglass-split me-1"></i>Chờ</span>;
            case 'IN_PROGRESS':
                return <span className="badge bg-primary px-2 py-1"><i className="bi bi-play-circle me-1"></i>Đang làm</span>;
            case 'COMPLETED':
                return <span className="badge bg-success px-2 py-1"><i className="bi bi-check-circle me-1"></i>Hoàn thành</span>;
            case 'CANCELLED':
                return <span className="badge bg-danger px-2 py-1"><i className="bi bi-x-circle me-1"></i>Đã hủy</span>;
            default:
                return <span className="badge bg-secondary px-2 py-1">{status || "—"}</span>;
        }
    };

    // Xử lý logic Lọc dữ liệu
    const filteredTasks = allTasks.filter(task => {
        const parsedValues = task.values || {};
        const status = parsedValues.status || '';
        
        const matchProject = projectFilter ? task.projectId.toString() === projectFilter : true;
        const matchStatus = statusFilter ? status === statusFilter : true;
        
        return matchProject && matchStatus;
    });

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="mb-4">
                <h4 className="fw-bold text-dark d-flex align-items-center">
                    <i className="bi bi-bar-chart-steps text-primary me-2"></i>
                    Tổng quan công việc toàn hệ thống
                </h4>
                <p className="text-muted mb-0">Chế độ xem tích hợp (Aggregation View) dành cho người quản lý</p>
            </div>

            {/* Bộ lọc */}
            <div className="card border-0 shadow-sm mb-4 bg-light" style={{ borderRadius: '12px' }}>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label text-secondary small fw-bold mb-1">Lọc theo dự án</label>
                            <select 
                                className="form-select form-select-sm" 
                                value={projectFilter} 
                                onChange={(e) => setProjectFilter(e.target.value)}
                            >
                                <option value="">-- Tất cả các dự án --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-secondary small fw-bold mb-1">Lọc theo tiến độ</label>
                            <select 
                                className="form-select form-select-sm" 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="PENDING">Chờ (Pending)</option>
                                <option value="IN_PROGRESS">Đang làm (In Progress)</option>
                                <option value="COMPLETED">Hoàn thành (Completed)</option>
                                <option value="CANCELLED">Đã hủy (Cancelled)</option>
                            </select>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button 
                                className="btn btn-outline-secondary btn-sm px-3"
                                onClick={() => { setProjectFilter(''); setStatusFilter(''); }}
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold text-secondary">Danh sách tổng hợp ({filteredTasks.length} công việc)</h6>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="small text-muted py-3 ps-4" style={{width: '30%'}}>Tên công việc / Mô tả</th>
                                <th className="small text-muted py-3">Dự án</th>
                                <th className="small text-muted py-3">Ngày giao</th>
                                <th className="small text-muted py-3">Dự kiến hoàn thành</th>
                                <th className="small text-muted py-3">Trạng thái</th>
                                <th className="small text-muted py-3 text-center pe-4">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                                        Đang gom dữ liệu toàn hệ thống...
                                    </td>
                                </tr>
                            ) : filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary opacity-50"></i>
                                        Không tìm thấy công việc nào phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => {
                                    const parsedValues = task.values || {};
                                    
                                    // BỌC LÓT DÒ TÌM NGÀY SIÊU CHUẨN
                                    const assignedDate = 
                                        parsedValues.startday || 
                                        parsedValues.assigned_date || 
                                        Object.entries(parsedValues).find(([k]) => k.toLowerCase().includes('start') || k.toLowerCase().includes('giao'))?.[1] || 
                                        "—";
                                        
                                    const dueDate = 
                                        parsedValues.deadline || 
                                        parsedValues.due_date || 
                                        Object.entries(parsedValues).find(([k]) => k.toLowerCase().includes('deadline') || k.toLowerCase().includes('due') || k.toLowerCase().includes('hoàn thành'))?.[1] || 
                                        "—";

                                    return (
                                        <tr key={task.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{parsedValues.title || "Chưa có tên"}</div>
                                                <div className="small text-muted text-truncate" style={{maxWidth: '280px'}}>
                                                    {parsedValues.description || parsedValues.content || "Không có mô tả"}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {task.projectName}
                                                </span>
                                            </td>
                                            <td className="small text-dark fw-medium">{assignedDate}</td>
                                            <td className="small text-dark fw-medium">{dueDate}</td>
                                            <td>
                                                {renderStatusBadge(parsedValues.status)}
                                            </td>
                                            <td className="text-center pe-4">
                                                <Link to={`/projects/${task.projectId}`} className="btn btn-sm btn-light border text-primary" style={{ fontSize: '12px' }}>
                                                    <i className="bi bi-box-arrow-up-right me-1"></i>Tới tab gốc
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}