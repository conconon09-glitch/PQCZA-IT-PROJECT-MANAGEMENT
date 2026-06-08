import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectFormCore from '../components/ProjectFormCore';

export default function EditProjectPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject]       = useState(null)
    const [allProjects, setAllProjects] = useState([])

    useEffect(() => {
        // Load dự án đang sửa
        axios.get(`http://localhost:8080/admin/projects/${id}`)
            .then(res => setProject(res.data.data))

        // Load tất cả dự án để kiểm tra trùng deadline
        axios.get('http://localhost:8080/admin/projects')
            .then(res => {
                if (res.data.status) setAllProjects(res.data.data)
            })
    }, [id])

    const handleUpdate = async (data) => {
        await axios.put(`http://localhost:8080/admin/projects/${id}`, data)
        navigate('/')
    }

    return project ? (
        <ProjectFormCore
            title="Cập nhật dự án"
            initialData={project}
            onSubmit={handleUpdate}
            allProjects={allProjects}
            editingId={Number(id)}   // Để bỏ qua chính nó khi check trùng
        />
    ) : (
        <div className="text-center mt-5">Đang tải...</div>
    )
}