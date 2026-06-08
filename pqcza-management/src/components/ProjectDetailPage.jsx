import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = 'http://localhost:8080/admin/projects'

const APP_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6']
const getAppColor = (id) => APP_COLORS[((id ?? 1) - 1) % APP_COLORS.length]

const FIELD_TYPES = [
    { value: 'text',     label: 'Văn bản ngắn' },
    { value: 'textarea', label: 'Văn bản dài' },
    { value: 'number',   label: 'Số' },
    { value: 'date',     label: 'Ngày' },
    { value: 'select',   label: 'Lựa chọn' },
]

const ICON_OPTIONS = [
    'bi-journal-text','bi-list-check','bi-diagram-3-fill','bi-tag-fill',
    'bi-book-fill','bi-code-slash','bi-bug','bi-gear-fill',
    'bi-people-fill','bi-file-earmark-text','bi-camera','bi-chat-dots',
    'bi-star-fill','bi-lightning-fill','bi-shield-fill','bi-table',
]

const COLOR_OPTIONS = [
    '#6366f1','#3b82f6','#10b981','#f59e0b',
    '#ef4444','#8b5cf6','#ec4899','#14b8a6',
    '#f97316','#06b6d4','#84cc16','#64748b',
]

function Modal({ show, title, onClose, children, size = '560px' }) {
    if (!show) return null
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '16px',
                width: '100%', maxWidth: size,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 24px 14px', borderBottom: '1px solid #f1f5f9',
                    position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1
                }}>
                    <h6 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{title}</h6>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', fontSize: '18px'
                    }}>✕</button>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>{children}</div>
            </div>
        </div>
    )
}

function ModalFooter({ onClose, onSave, loading, saveLabel = 'Lưu' }) {
    return (
        <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary btn-sm px-3" onClick={onClose} disabled={loading}>Hủy</button>
            <button className="btn btn-primary btn-sm px-3" onClick={onSave} disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-1"></span>}
                {saveLabel}
            </button>
        </div>
    )
}

function DynamicForm({ fields, values, onChange }) {
    return (
        <div>
            {fields.map(field => (
                <div className="mb-3" key={field.fieldKey}>
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                        {field.label}
                    </label>
                    {field.fieldType === 'textarea' ? (
                        <textarea className="form-control" rows={3}
                            value={values[field.fieldKey] || ''}
                            onChange={e => onChange({ ...values, [field.fieldKey]: e.target.value })} />
                    ) : field.fieldType === 'select' ? (
                        <select className="form-select"
                            value={values[field.fieldKey] || ''}
                            onChange={e => onChange({ ...values, [field.fieldKey]: e.target.value })}>
                            <option value="">-- Chọn --</option>
                            {(() => {
                                try {
                                    const opts = typeof field.options === 'string'
                                        ? JSON.parse(field.options)
                                        : (field.options || [])
                                    return opts.map(opt => <option key={opt} value={opt}>{opt}</option>)
                                } catch { return null }
                            })()}
                        </select>
                    ) : (
                        <input type={field.fieldType || 'text'} className="form-control"
                            value={values[field.fieldKey] || ''}
                            onChange={e => onChange({ ...values, [field.fieldKey]: e.target.value })} />
                    )}
                </div>
            ))}
        </div>
    )
}

function FieldValue({ field, value }) {
    if (!value) return <span className="text-muted" style={{ fontSize: '13px' }}>—</span>
    if (field.fieldType === 'select') {
        const colors = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', COMPLETED: '#10b981', CANCELLED: '#6b7280' }
        const labels = { PENDING: '⏳ Chờ', IN_PROGRESS: '🔄 Đang làm', COMPLETED: '✅ Xong', CANCELLED: '❌ Hủy' }
        const c = colors[value] || '#6b7280'
        return (
            <span className="badge rounded-pill px-2"
                style={{ backgroundColor: c + '18', color: c, border: `1px solid ${c}40`, fontSize: '11px' }}>
                {labels[value] || value}
            </span>
        )
    }
    return <span style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{value}</span>
}

function SectionTab({ section, projectId }) {
    const [entries, setEntries]       = useState([])
    const [showModal, setShowModal]   = useState(false)
    const [editing, setEditing]       = useState(null)
    const [formValues, setFormValues] = useState({})
    const [loading, setLoading]       = useState(false)

    const fields = section.fields || []

    const loadEntries = useCallback(() => {
        axios.get(`${BASE}/${projectId}/sections/${section.id}/entries`)
            .then(r => setEntries(r.data.data || []))
            .catch(() => {})
    }, [projectId, section.id])

    useEffect(() => { loadEntries() }, [loadEntries])

    const openAdd = () => { setEditing(null); setFormValues({}); setShowModal(true) }

    const openEdit = (entry) => {
        setEditing(entry)
        setFormValues(entry.values || {})
        setShowModal(true)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const fieldIdMap = {}
            fields.forEach(f => { fieldIdMap[f.id] = formValues[f.fieldKey] || '' })
            const payload = { values: fieldIdMap }

            if (editing) {
                await axios.put(`${BASE}/${projectId}/sections/${section.id}/entries/${editing.id}`, payload)
            } else {
                await axios.post(`${BASE}/${projectId}/sections/${section.id}/entries`, payload)
            }
            loadEntries()
            setShowModal(false)
        } finally { setLoading(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa mục này?')) return
        await axios.delete(`${BASE}/${projectId}/sections/${section.id}/entries/${id}`)
        loadEntries()
    }

    const getTitle = (entry) => {
        const v = entry.values || {}
        return v.title || v.content?.substring(0, 60) || v.version || `#${entry.id}`
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">{entries.length} mục</span>
                <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={openAdd}>
                    <i className="bi bi-plus me-1"></i>Thêm
                </button>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className={`bi ${section.icon || 'bi-table'} fs-1 d-block mb-2 opacity-25`}></i>
                    <p className="mb-0">Chưa có dữ liệu</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {entries.map(entry => {
                        const parsed = entry.values || {}
                        return (
                            <div key={entry.id} className="p-3 rounded-3"
                                style={{ backgroundColor: section.color + '0d', border: `1px solid ${section.color}30` }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>{getTitle(entry)}</strong>
                                    <div className="d-flex gap-1 ms-2 flex-shrink-0">
                                        <button onClick={() => openEdit(entry)} style={{
                                            width: 30, height: 30, borderRadius: '8px',
                                            border: '1px solid #bfdbfe', backgroundColor: '#eff6ff',
                                            color: '#3b82f6', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <i className="bi bi-pencil" style={{ fontSize: '12px' }}></i>
                                        </button>
                                        <button onClick={() => handleDelete(entry.id)} style={{
                                            width: 30, height: 30, borderRadius: '8px',
                                            border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                                            color: '#ef4444', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <i className="bi bi-trash" style={{ fontSize: '12px' }}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap gap-3">
                                    {fields.slice(1).map(f => parsed[f.fieldKey] ? (
                                        <div key={f.fieldKey}>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{f.label}: </span>
                                            <FieldValue field={f} value={parsed[f.fieldKey]} />
                                        </div>
                                    ) : null)}
                                </div>
                                {entry.createdAt && (
                                    <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                                        {new Date(entry.createdAt).toLocaleString('vi-VN')}
                                    </small>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <Modal show={showModal}
                title={editing ? `Sửa — ${section.name}` : `Thêm — ${section.name}`}
                onClose={() => setShowModal(false)}>
                <DynamicForm fields={fields} values={formValues} onChange={setFormValues} />
                <ModalFooter onClose={() => setShowModal(false)} onSave={handleSave} loading={loading} />
            </Modal>
        </div>
    )
}

function SectionFormModal({ show, onClose, onSave, editing }) {
    const [name, setName]     = useState('')
    const [icon, setIcon]     = useState('bi-table')
    const [color, setColor]   = useState('#6366f1')
    const [fields, setFields] = useState([{ key: 'content', label: 'Nội dung', type: 'textarea' }])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (editing) {
            setName(editing.name || '')
            setIcon(editing.icon || 'bi-table')
            setColor(editing.color || '#6366f1')
            setFields((editing.fields || []).map(f => ({
                key: f.fieldKey,
                label: f.label,
                type: f.fieldType,
                options: (() => {
                    try {
                        return typeof f.options === 'string' ? JSON.parse(f.options) : (f.options || [])
                    } catch { return [] }
                })()
            })))
        } else {
            setName(''); setIcon('bi-table'); setColor('#6366f1')
            setFields([{ key: 'content', label: 'Nội dung', type: 'textarea' }])
        }
    }, [editing, show])

    const addField    = () => setFields([...fields, { key: `field_${Date.now()}`, label: '', type: 'text' }])
    const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx))
    const updateField = (idx, key, val) => {
        const f = [...fields]
        f[idx] = { ...f[idx], [key]: val }
        if (key === 'label') {
            f[idx].key = val.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || `field_${idx}`
        }
        setFields(f)
    }

    const handleSave = async () => {
        if (!name.trim()) return
        setLoading(true)
        try {
            await onSave({
                name, icon, color,
                fields: fields.map((f, i) => ({
                    fieldKey:  f.key,
                    label:     f.label,
                    fieldType: f.type,
                    options:   f.options?.length ? JSON.stringify(f.options) : null,
                    sortOrder: i
                }))
            })
            onClose()
        } finally { setLoading(false) }
    }

    return (
        <Modal show={show} title={editing ? 'Sửa bảng' : 'Tạo bảng mới'} onClose={onClose} size="640px">
            <div className="mb-3">
                <label className="form-label fw-semibold">Tên bảng <span className="text-danger">*</span></label>
                <input className="form-control" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="VD: Ghi chú code, Bug tracker..." />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Icon</label>
                <div className="d-flex flex-wrap gap-2">
                    {ICON_OPTIONS.map(ic => (
                        <button key={ic} onClick={() => setIcon(ic)} style={{
                            width: 36, height: 36, borderRadius: '8px', cursor: 'pointer',
                            border: icon === ic ? `2px solid ${color}` : '1px solid #e2e8f0',
                            backgroundColor: icon === ic ? color + '20' : '#f8fafc',
                            color: icon === ic ? color : '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className={`bi ${ic}`}></i>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Màu</label>
                <div className="d-flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{
                            width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                            backgroundColor: c,
                            border: color === c ? '3px solid #1e293b' : '2px solid transparent',
                            boxShadow: color === c ? `0 0 0 2px ${c}50` : 'none'
                        }} />
                    ))}
                </div>
            </div>

            <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <small className="text-muted d-block mb-2">Preview tab</small>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    borderRadius: '12px', padding: '8px 14px',
                    backgroundColor: color, color: '#fff',
                    boxShadow: `0 4px 12px ${color}50`
                }}>
                    <i className={`bi ${icon}`} style={{ fontSize: '15px' }}></i>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{name || 'Tên bảng'}</span>
                </div>
            </div>

            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">Các trường dữ liệu</label>
                    <button className="btn btn-sm btn-outline-primary" onClick={addField}
                        style={{ borderRadius: '8px', fontSize: '12px' }}>
                        <i className="bi bi-plus me-1"></i>Thêm trường
                    </button>
                </div>
                <div className="d-flex flex-column gap-2">
                    {fields.map((f, idx) => (
                        <div key={idx} className="p-2 rounded-3 d-flex gap-2 align-items-center"
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div className="row g-2 flex-grow-1 align-items-center">
                                <div className="col-5">
                                    <input className="form-control form-control-sm"
                                        placeholder="Tên hiển thị VD: Nội dung"
                                        value={f.label}
                                        onChange={e => updateField(idx, 'label', e.target.value)} />
                                </div>
                                <div className="col-4">
                                    <select className="form-select form-select-sm" value={f.type}
                                        onChange={e => updateField(idx, 'type', e.target.value)}>
                                        {FIELD_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>key: {f.key}</span>
                                </div>
                                {f.type === 'select' && (
                                    <div className="col-12">
                                        <input className="form-control form-control-sm"
                                            placeholder="Các lựa chọn cách nhau bởi dấu phẩy: A,B,C"
                                            value={(f.options || []).join(',')}
                                            onChange={e => updateField(idx, 'options', e.target.value.split(',').map(s => s.trim()))} />
                                    </div>
                                )}
                            </div>
                            <button onClick={() => removeField(idx)} style={{
                                width: 28, height: 28, borderRadius: '6px', flexShrink: 0,
                                border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                                color: '#ef4444', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className="bi bi-x" style={{ fontSize: '14px' }}></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ModalFooter onClose={onClose} onSave={handleSave} loading={loading}
                saveLabel={editing ? 'Cập nhật' : 'Tạo bảng'} />
        </Modal>
    )
}

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject]                 = useState(null)
    const [sections, setSections]               = useState([])
    const [activeTab, setActiveTab]             = useState(null)
    const [showSectionForm, setShowSectionForm] = useState(false)
    const [editingSection, setEditingSection]   = useState(null)
    const [error, setError]                     = useState(null)
    const [seeded, setSeeded]                   = useState(false)

    useEffect(() => {
        axios.get(`${BASE}/${id}`)
            .then(r => setProject(r.data.data))
            .catch(() => setError('Không tải được thông tin dự án'))
    }, [id])

    const loadSections = useCallback(() => {
        axios.get(`${BASE}/${id}/sections`)
            .then(r => {
                const data = r.data.data || []
                setSections(data)
                if (data.length > 0 && activeTab === null) setActiveTab(data[0].id)
            })
            .catch(() => {})
    }, [id])

    useEffect(() => {
        if (!project || seeded) return
        setSeeded(true)
        axios.post(`${BASE}/${id}/sections/seed`)
            .finally(() => loadSections())
    }, [project, id, loadSections, seeded])

    const handleCreateSection = async (req) => {
        await axios.post(`${BASE}/${id}/sections`, req)
        loadSections()
    }

    const handleUpdateSection = async (req) => {
        await axios.put(`${BASE}/${id}/sections/${editingSection.id}`, req)
        loadSections()
    }

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm('Xóa bảng này và toàn bộ dữ liệu bên trong?')) return
        await axios.delete(`${BASE}/${id}/sections/${sectionId}`)
        if (activeTab === sectionId) setActiveTab(null)
        loadSections()
    }

    const openEditSection   = (s) => { setEditingSection(s); setShowSectionForm(true) }
    const openCreateSection = () => { setEditingSection(null); setShowSectionForm(true) }

    if (error) return (
        <div className="text-center mt-5">
            <i className="bi bi-exclamation-triangle text-danger fs-1 d-block mb-2"></i>
            <p className="text-danger">{error}</p>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/')}>
                <i className="bi bi-arrow-left me-1"></i>Quay lại
            </button>
        </div>
    )

    if (!project) return (
        <div className="text-center mt-5 text-muted">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p>Đang tải...</p>
        </div>
    )

    const appColor      = getAppColor(project.id)
    const activeSection = sections.find(s => s.id === activeTab)

    return (
        <div>
            <div className="d-flex align-items-center gap-3 mb-4">
                <button onClick={() => navigate('/')} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '1px solid #e2e8f0', backgroundColor: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                }}>
                    <i className="bi bi-arrow-left" style={{ color: '#64748b' }}></i>
                </button>
                <div style={{
                    width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
                    backgroundColor: appColor, boxShadow: `0 4px 12px ${appColor}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <i className="bi bi-grid-3x3-gap-fill text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 className="fw-bold mb-0 text-truncate" style={{ color: '#1e293b' }}>{project.name}</h5>
                    <small className="text-muted">ID: {project.id}</small>
                </div>
                <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-sm flex-shrink-0"
                    style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                    <i className="bi bi-pencil-square me-1"></i>Chỉnh sửa
                </button>
            </div>

            <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: '14px' }}>
                <div className="row g-2">
                    <div className="col-md-8">
                        <small className="text-muted d-block mb-1">Mô tả</small>
                        <div style={{ fontSize: '13px' }}
                            dangerouslySetInnerHTML={{ __html: project.description || '<em class="text-muted">Chưa có mô tả</em>' }} />
                    </div>
                    <div className="col-md-4">
                        <small className="text-muted d-block mb-1">Trạng thái</small>
                        <span className="badge rounded-pill px-3 py-2"
                            style={{ backgroundColor: appColor + '20', color: appColor, border: `1px solid ${appColor}40` }}>
                            {project.status}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
                {sections.map(tab => (
                    <div key={tab.id} style={{ position: 'relative' }}>
                        <button onClick={() => setActiveTab(tab.id)} style={{
                            border: 'none', borderRadius: '12px', padding: '10px 14px',
                            backgroundColor: activeTab === tab.id ? tab.color : '#f8fafc',
                            color: activeTab === tab.id ? '#fff' : '#64748b',
                            boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}50` : 'none',
                            transition: 'all 0.15s', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <i className={`bi ${tab.icon || 'bi-table'}`} style={{ fontSize: '15px' }}></i>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{tab.name}</span>
                        </button>
                        <div style={{ position: 'absolute', top: -6, right: -6, display: 'flex', gap: '2px' }}>
                            <button onClick={() => openEditSection(tab)} style={{
                                width: 18, height: 18, borderRadius: '50%', padding: 0,
                                backgroundColor: '#3b82f6', border: '1.5px solid #fff',
                                color: '#fff', cursor: 'pointer', fontSize: '9px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button onClick={() => handleDeleteSection(tab.id)} style={{
                                width: 18, height: 18, borderRadius: '50%', padding: 0,
                                backgroundColor: '#ef4444', border: '1.5px solid #fff',
                                color: '#fff', cursor: 'pointer', fontSize: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={openCreateSection} style={{
                    border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '8px 14px',
                    backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8' }}
                >
                    <i className="bi bi-plus-circle" style={{ fontSize: '15px' }}></i>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Tạo bảng mới</span>
                </button>
            </div>

            {activeSection ? (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px', minHeight: '300px' }}>
                    <h6 className="fw-bold mb-3" style={{ color: activeSection.color }}>
                        <i className={`bi ${activeSection.icon || 'bi-table'} me-2`}></i>
                        {activeSection.name}
                    </h6>
                    <hr className="mt-0 mb-3" />
                    <SectionTab key={activeSection.id} section={activeSection} projectId={id} />
                </div>
            ) : (
                <div className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm mb-2" role="status"></div>
                    <p className="mb-0">Đang tải bảng dữ liệu...</p>
                </div>
            )}

            <SectionFormModal
                show={showSectionForm}
                onClose={() => setShowSectionForm(false)}
                editing={editingSection}
                onSave={editingSection ? handleUpdateSection : handleCreateSection}
            />
        </div>
    )
}