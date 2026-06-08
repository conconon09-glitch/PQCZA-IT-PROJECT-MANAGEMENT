import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import ProjectList      from './components/ProjectList'
import AddProjectPage   from './components/AddProjectPage'
import EditProjectPage  from './components/EditProjectPage'
import LoginPage        from './components/LoginPage'
import ProjectDetailPage from './components/ProjectDetailPage'
import TaskPage         from './components/TaskPage'

function PrivateRoute({ children }) {
    const user = localStorage.getItem('user')
    return user ? children : <Navigate to="/login" />
}

function NavigationBar() {
    const navigate = useNavigate()
    const user = localStorage.getItem('user')

    if (!user) return null

    // Hàm xử lý hiển thị tên Admin an toàn
    const getAdminName = () => {
        try {
            if (user.startsWith('{') || user.startsWith('[')) {
                const parsed = JSON.parse(user)
                return parsed.username || parsed.name || 'Admin'
            }
            return user
        } catch (e) {
            return 'Admin'
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3 mb-4" 
             style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
                    🚀 <span style={{ fontSize: 18 }}>Quản Lý Dự Án</span>
                </Link>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
                        <Link to="/" className="nav-link fw-semibold px-3 text-secondary">
                            📁 Danh sách dự án
                        </Link>
                        <Link to="/tasks" className="nav-link fw-semibold px-3 text-secondary">
                            📋 Quản lý Task tổng
                        </Link>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted small">👋 Xin chào, <strong className="text-dark">{getAdminName()}</strong></span>
                        <button className="btn btn-sm btn-outline-danger px-3" 
                                style={{ borderRadius: 8 }} 
                                onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function App() {
    return (
        <div className="container my-5">
            <NavigationBar /> 
            <Routes>
                <Route path="/login"        element={<LoginPage />} />
                <Route path="/"             element={<PrivateRoute><ProjectList /></PrivateRoute>} />
                <Route path="/add"          element={<PrivateRoute><AddProjectPage /></PrivateRoute>} />
                <Route path="/edit/:id"     element={<PrivateRoute><EditProjectPage /></PrivateRoute>} />
                <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
                <Route path="/tasks"        element={<PrivateRoute><TaskPage /></PrivateRoute>} />
            </Routes>
        </div>
    )
}

export default App