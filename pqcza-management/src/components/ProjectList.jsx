import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const API_URL = 'http://localhost:8080/admin/projects'

const STATUS_BADGE = {
    PENDING:     { color: '#f59e0b', bg: '#fffbeb', label: '⏳ Chờ thực hiện' },
    IN_PROGRESS: { color: '#3b82f6', bg: '#eff6ff', label: '🔄 Đang thực hiện' },
    COMPLETED:   { color: '#10b981', bg: '#ecfdf5', label: '✅ Hoàn thành' },
    CANCELLED:   { color: '#6b7280', bg: '#f9fafb', label: '❌ Đã hủy' },
}

const STATUS_LABEL = {
    PENDING:     'Chờ thực hiện',
    IN_PROGRESS: 'Đang thực hiện',
    COMPLETED:   'Hoàn thành',
    CANCELLED:   'Đã hủy',
}

const APP_GRADIENTS = [
    ['#6366f1', '#8b5cf6'],
    ['#3b82f6', '#06b6d4'],
    ['#10b981', '#059669'],
    ['#f59e0b', '#ef4444'],
    ['#ec4899', '#f43f5e'],
    ['#8b5cf6', '#6366f1'],
    ['#14b8a6', '#10b981'],
    ['#f97316', '#f59e0b'],
]

const APP_ICONS = [
    <svg viewBox="0 0 40 40" fill="none"><rect x="6" y="10" width="28" height="18" rx="3" stroke="white" strokeWidth="2.2" fill="none"/><path d="M14 22l-4-4 4-4M26 14l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><rect x="7" y="22" width="6" height="12" rx="1.5" fill="white"/><rect x="17" y="14" width="6" height="20" rx="1.5" fill="white"/><rect x="27" y="8" width="6" height="26" rx="1.5" fill="white"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><path d="M20 6c0 0 8 4 8 14l-8 14-8-14c0-10 8-14 8-14z" stroke="white" strokeWidth="2" fill="none"/><circle cx="20" cy="18" r="3" fill="white"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><path d="M20 5l12 5v10c0 7-5 13-12 15C13 33 8 27 8 20V10l12-5z" stroke="white" strokeWidth="2" fill="none"/><path d="M14 20l4 4 8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="13" stroke="white" strokeWidth="2" fill="none"/><ellipse cx="20" cy="20" rx="5.5" ry="13" stroke="white" strokeWidth="1.8" fill="none"/><line x1="7" y1="20" x2="33" y2="20" stroke="white" strokeWidth="1.8"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><path d="M20 8a10 10 0 0 1 6 18v2H14v-2A10 10 0 0 1 20 8z" stroke="white" strokeWidth="2" fill="none"/><rect x="15" y="28" width="10" height="3" rx="1.5" stroke="white" strokeWidth="1.8" fill="none"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="13" rx="11" ry="5" stroke="white" strokeWidth="2" fill="none"/><path d="M9 13v14c0 2.8 4.9 5 11 5s11-2.2 11-5V13" stroke="white" strokeWidth="2" fill="none"/><path d="M9 20c0 2.8 4.9 5 11 5s11-2.2 11-5" stroke="white" strokeWidth="1.8" fill="none"/></svg>,
    <svg viewBox="0 0 40 40" fill="none"><line x1="10" y1="8" x2="10" y2="34" stroke="white" strokeWidth="2.2" strokeLinecap="round"/><path d="M10 10h16l-4 6 4 6H10V10z" fill="white" opacity="0.9"/></svg>,
]

function getGradient(id) {
    const g = APP_GRADIENTS[(id - 1) % APP_GRADIENTS.length]
    return `linear-gradient(135deg, ${g[0]}, ${g[1]})`
}
function getIcon(id) {
    return APP_ICONS[(id - 1) % APP_ICONS.length]
}

function AppLogo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
                width: 38, height: 38, borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(59,130,246,0.4)'
            }}>
                <svg viewBox="0 0 32 32" fill="none" style={{ width: 22, height: 22 }}>
                    <rect x="3" y="3" width="11" height="11" rx="2.5" fill="white" opacity="0.95"/>
                    <rect x="18" y="3" width="11" height="11" rx="2.5" fill="white" opacity="0.7"/>
                    <rect x="3" y="18" width="11" height="11" rx="2.5" fill="white" opacity="0.7"/>
                    <rect x="18" y="18" width="11" height="11" rx="2.5" fill="white" opacity="0.5"/>
                </svg>
            </div>
            <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#1e3a8a', letterSpacing: '-0.3px' }}>PQCZA</div>
                <div style={{ fontWeight: 400, fontSize: '10px', color: '#64748b', letterSpacing: '1.5px', textTransform: 'uppercase' }}>IT Projects</div>
            </div>
        </div>
    )
}

function DeleteModal({ project, onConfirm, onClose }) {
    if (!project) return null
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px'
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div style={{
                backgroundColor: '#fff', borderRadius: '20px',
                width: '100%', maxWidth: '380px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                overflow: 'hidden'
            }}>
                <div style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="bi bi-exclamation-triangle-fill text-white" style={{ fontSize: '18px' }}></i>
                    <h6 style={{ margin: 0, color: '#fff', fontWeight: 700 }}>Xác nhận xóa</h6>
                </div>
                <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '14px',
                        background: getGradient(project.id),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ width: 28, height: 28 }}>{getIcon(project.id)}</div>
                    </div>
                    <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Bạn có chắc chắn muốn xóa</p>
                    <strong style={{ color: '#1e293b', display: 'block', marginTop: '4px', fontSize: '15px' }}>{project.name}</strong>
                    <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '12px' }}>Toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
                </div>
                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} className="btn btn-secondary btn-sm flex-fill">Hủy</button>
                    <button onClick={onConfirm} className="btn btn-danger btn-sm flex-fill">Đồng ý xóa</button>
                </div>
            </div>
        </div>
    )
}

function ProjectCard({ project, onDelete, navigate }) {
    const badge = STATUS_BADGE[project.status] || { color: '#6b7280', bg: '#f9fafb', label: project.status }
    const [pressing, setPressing] = useState(false)

    const shortName = project.name.length > 14
        ? project.name.substring(0, 13) + '…'
        : project.name

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', position: 'relative', padding: '4px' }}>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(project) }}
                style={{
                    position: 'absolute', top: 0, left: 8, zIndex: 10,
                    width: 20, height: 20, borderRadius: '50%',
                    backgroundColor: '#ef4444', border: '2px solid #fff',
                    color: '#fff', fontSize: '13px', lineHeight: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    padding: 0
                }}
            >
                <i className="bi bi-dash" style={{ fontSize: '12px', fontWeight: 900 }}></i>
            </button>

            <div
                onClick={() => navigate(`/projects/${project.id}`)}
                onMouseDown={() => setPressing(true)}
                onMouseUp={() => setPressing(false)}
                onMouseLeave={() => setPressing(false)}
                style={{
                    width: 76, height: 76,
                    borderRadius: '18px',
                    background: getGradient(project.id),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: pressing ? '0 2px 8px rgba(0,0,0,0.15)' : '0 5px 18px rgba(0,0,0,0.16)',
                    transform: pressing ? 'scale(0.93)' : 'scale(1)',
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    position: 'relative', overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                    borderRadius: '18px 18px 0 0',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
                    pointerEvents: 'none'
                }} />
                <div style={{ width: 38, height: 38 }}>{getIcon(project.id)}</div>
            </div>

            <div style={{
                position: 'absolute', bottom: 26, right: 10,
                width: 11, height: 11, borderRadius: '50%',
                backgroundColor: badge.color,
                border: '2px solid #f8fafc',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
            }} title={badge.label} />

            <span style={{
                fontSize: '11px', fontWeight: 500,
                color: '#1e293b', textAlign: 'center',
                lineHeight: 1.3, wordBreak: 'break-word',
                maxWidth: '80px', display: 'block'
            }}>
                {shortName}
            </span>
        </div>
    )
}

function ProjectList() {
    const [projects, setProjects]               = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [currentPage, setCurrentPage]         = useState(1)
    const [keyword, setKeyword]                 = useState('')
    const [filterStatus, setFilterStatus]       = useState('')
    const navigate = useNavigate()

    const PAGE_SIZE = 18  // 6 cột x 3 hàng

    const user = (() => {
        try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
    })()
    const username = user?.username || 'Admin'

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_URL)
            if (response?.data?.status) {
                setProjects(response.data.data)
            }
        } catch (error) {
            console.error("Lỗi kết nối Backend:", error.response ? error.response.data : error.message)
        }
    }

    const handleDelete = async () => {
        if (!selectedProject) return
        try {
            await axios.delete(`${API_URL}/${selectedProject.id}`)
            await fetchProjects()
        } catch (error) {
            console.error("Lỗi khi xóa:", error)
        } finally {
            setSelectedProject(null)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    const handleExportExcel = () => {
        const exportData = projects.map((p) => ({
            'ID':         p.id,
            'Tên dự án':  p.name,
            'Mô tả':      p.description?.replace(/<[^>]*>/g, '') || '',
            'Trạng thái': STATUS_LABEL[p.status] || p.status || '',
        }))
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook  = XLSX.utils.book_new()
        worksheet['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 40 }, { wch: 18 }]
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách dự án')
        const blob = new Blob(
            [XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })],
            { type: 'application/octet-stream' }
        )
        saveAs(blob, `danh-sach-du-an-${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    useEffect(() => { fetchProjects() }, [])

    const filteredData = projects.filter((p) => {
        const matchKeyword = keyword === '' || p.name?.toLowerCase().includes(keyword.toLowerCase())
        const matchStatus  = filterStatus === '' || p.status === filterStatus
        return matchKeyword && matchStatus
    })

    const totalPages  = Math.ceil(filteredData.length / PAGE_SIZE)
    const startIndex  = (currentPage - 1) * PAGE_SIZE
    const currentData = filteredData.slice(startIndex, startIndex + PAGE_SIZE)

    const stats = {
        total:      projects.length,
        pending:    projects.filter(p => p.status === 'PENDING').length,
        inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
        completed:  projects.filter(p => p.status === 'COMPLETED').length,
    }

    return (
        <div>
            {/* Top bar */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3"
                style={{ borderBottom: '1px solid #e2e8f0' }}>
                <AppLogo />
                <div className="d-flex align-items-center gap-3 flex-wrap">
                   
                    <button onClick={handleExportExcel} className="btn btn-sm"
                        style={{ backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                        <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
                    </button>
                    <Link to="/add" className="btn btn-sm"
                        style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px' }}>
                        <i className="bi bi-plus-circle me-1"></i>Thêm dự án
                    </Link>
                    
                </div>
            </div>

            {/* Tiêu đề */}
            <div className="mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>📋 Danh sách dự án</h5>
                <small className="text-muted">
                    Hiển thị <strong>{filteredData.length}</strong> / {projects.length} dự án
                </small>
            </div>

            {/* Thống kê */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Tổng dự án',     value: stats.total,      color: '#6366f1', bg: '#eef2ff', icon: 'bi-stack' },
                    { label: 'Chờ thực hiện',  value: stats.pending,    color: '#f59e0b', bg: '#fffbeb', icon: 'bi-hourglass-split' },
                    { label: 'Đang thực hiện', value: stats.inProgress, color: '#3b82f6', bg: '#eff6ff', icon: 'bi-arrow-repeat' },
                    { label: 'Hoàn thành',     value: stats.completed,  color: '#10b981', bg: '#ecfdf5', icon: 'bi-check-circle-fill' },
                ].map((s, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <div className="p-3 d-flex align-items-center gap-3"
                            style={{ backgroundColor: s.bg, borderRadius: '12px', border: `1px solid ${s.color}20` }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '10px',
                                backgroundColor: s.color + '20',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '18px' }}></i>
                            </div>
                            <div>
                                <div className="fw-bold" style={{ fontSize: '20px', color: s.color }}>{s.value}</div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>{s.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tìm kiếm & lọc */}
            <div className="p-3 mb-3"
                style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div className="row g-2 align-items-center">
                    <div className="col-md-7">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text border-0"
                                style={{ backgroundColor: '#fff', borderRadius: '8px 0 0 8px' }}>
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input type="text" className="form-control border-0 shadow-none"
                                style={{ borderRadius: '0 8px 8px 0' }}
                                placeholder="Tìm theo tên dự án..."
                                value={keyword}
                                onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select form-select-sm border-0"
                            style={{ borderRadius: '8px', backgroundColor: '#fff' }}
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}>
                            <option value="">-- Tất cả trạng thái --</option>
                            <option value="PENDING">⏳ Chờ thực hiện</option>
                            <option value="IN_PROGRESS">🔄 Đang thực hiện</option>
                            <option value="COMPLETED">✅ Hoàn thành</option>
                            <option value="CANCELLED">❌ Đã hủy</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-sm w-100 border-0"
                            style={{ backgroundColor: '#fff', color: '#64748b', borderRadius: '8px' }}
                            onClick={() => { setKeyword(''); setFilterStatus(''); setCurrentPage(1) }}>
                            <i className="bi bi-arrow-counterclockwise me-1"></i>Đặt lại
                        </button>
                    </div>
                </div>
            </div>

            {/* Chú thích */}
            <div className="d-flex gap-3 mb-3 flex-wrap">
                {Object.entries(STATUS_BADGE).map(([key, val]) => (
                    <div key={key} className="d-flex align-items-center gap-1">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: val.color }}></div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{val.label}</span>
                    </div>
                ))}
            </div>

            {/* Grid 6 cột */}
            {currentData.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                    <p>{keyword || filterStatus ? 'Không tìm thấy dự án phù hợp' : 'Chưa có dữ liệu...'}</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '24px 8px',
                    padding: '24px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px'
                }}>
                    {currentData.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            navigate={navigate}
                            onDelete={(p) => setSelectedProject(p)}
                        />
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">Trang {currentPage} / {totalPages} &nbsp;·&nbsp; {filteredData.length} dự án</small>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                        </li>
                    </ul>
                </div>
            )}

            <DeleteModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default ProjectList