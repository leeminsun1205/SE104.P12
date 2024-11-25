// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import Players from './pages/Players/Players';
import Matches from './pages/Matches/Matches';
import Standings from './pages/Standings/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SignUp from './pages/SignUp/SignUp';
import './assets/styles/global.css';
import './assets/styles/variables.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Header onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            <div className="content">
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/teams/:teamId/players" element={<Players />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/standings" element={<Standings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;