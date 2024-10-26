// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/DashBoardPage/Dashboard';
import Teams from './pages/TeamsPage/Teams';
import Matches from './pages/MatchesPage/Matches';
import Standings from './pages/StandingsPage/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/LoginPage/Login';
import './assets/styles/global.css';
import './assets/styles/variables.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Header />
            <Sidebar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
