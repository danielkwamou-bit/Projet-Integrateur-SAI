import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/LoginPage.jsx';
import Actionneurs from './pages/Actionneurs.jsx';
import Seuils from './pages/Seuils.jsx';
import Sidebar from './components/Sidebar.jsx';
import './styles/dashboard.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"))

  const handleLogin = () => {
    setIsAuth(true)
    navigate('/dashboard')
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuth(false)
    navigate('/')
  }

  // Détermine si la sidebar doit s'afficher
  const showSidebar = isAuth && location.pathname !== "/"

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {showSidebar && (
        <>
          <button className="menu-toggle" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </>
      )}
      <div className={`app-content ${showSidebar ? "main-wrapper" : "auth-wrapper"}`}>
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/actionneurs" element={isAuth ? <Actionneurs /> : <Navigate to="/" />} />
          <Route path="/seuils" element={isAuth ? <Seuils /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
export default App;