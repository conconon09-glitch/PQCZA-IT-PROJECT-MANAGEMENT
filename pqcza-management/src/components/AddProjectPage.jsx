import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectFormCore from '../components/ProjectFormCore';

export default function AddProjectPage() {
    const navigate = useNavigate();
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/admin/projects') // Bỏ localhost
            .then(res => {
                if (res.data.status) setAllProjects(res.data.data);
            })
            .catch(err => console.error("Không thể lấy danh sách dự án:", err));
    }, []);

    const handleAdd = async (data) => {
        setLoading(true);
        try {
            await axios.post('/admin/projects', data); // Bỏ localhost
            navigate('/');
        } catch (error) {
            console.error("Lỗi thêm dự án:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu vào hệ thống nội bộ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectFormCore
            title="Thêm dự án mới"
            onSubmit={handleAdd}
            allProjects={allProjects}
            isLoading={loading} // Truyền trạng thái này vào component con để disable nút Submit
        />
    );
}