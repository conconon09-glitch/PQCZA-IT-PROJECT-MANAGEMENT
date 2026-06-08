import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await axios.post('http://localhost:8080/auth/login', { username, password })
            if (res.data.status) {
                // Lưu thông tin user vào localStorage
                localStorage.setItem('user', JSON.stringify(res.data.data))
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại')
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow" style={{ width: '400px' }}>
                <div className="card-header bg-primary text-white text-center py-3">
                    <h5 className="mb-0 fw-bold">🔐 Đăng nhập hệ thống</h5>
                </div>
                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tên đăng nhập</label>
                            <input
                                type="text" className="form-control"
                                placeholder="Nhập username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Mật khẩu</label>
                            <input
                                type="password" className="form-control"
                                placeholder="Nhập password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}