// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Teams from './components/Teams';
import Matches from './components/Matches';
import Standings from './components/Standings';
import Login from './components/Login';

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
                <Route path="/" element={<Dashboard />} />
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
