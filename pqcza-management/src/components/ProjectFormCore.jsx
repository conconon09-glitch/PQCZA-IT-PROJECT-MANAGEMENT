import React from 'react';
import ReactQuill from 'react-quill-new';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
    { value: 'PENDING',     label: '⏳ Chờ thực hiện' },
    { value: 'IN_PROGRESS', label: '🔄 Đang thực hiện' },
    { value: 'COMPLETED',   label: '✅ Hoàn thành' },
    { value: 'CANCELLED',   label: '❌ Đã hủy' },
]

export default function ProjectFormCore({ title, initialData, onSubmit, allProjects = [], editingId = null }) {
    const [name,        setName]        = React.useState(initialData?.name        || '')
    const [description, setDescription] = React.useState(initialData?.description || '')
    const [status,      setStatus]      = React.useState(initialData?.status       || 'PENDING')
    const [showWarning, setShowWarning] = React.useState(false)
    const [pendingData, setPendingData] = React.useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { name, description, status }
        onSubmit(data)
    }

    return (
        <div className="card shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
            <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-bold">{title}</h5>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>

                    {/* Tên dự án */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên dự án</label>
                        <input
                            type="text" className="form-control"
                            placeholder="Nhập tên dự án"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Trạng thái</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mô tả</label>
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            style={{ height: '200px', marginBottom: '50px' }}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Link to="/" className="btn btn-light border">Quay lại</Link>
                        <button type="submit" className="btn btn-primary px-4">{title}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}