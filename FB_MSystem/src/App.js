import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import AddTeam from './pages/Teams/AddTeam';
import EditTeam from './pages/Teams/EditTeam';
import Players from './pages/Players/Players';
import Matches from './pages/Matches/Matches';
import Standings from './pages/Standings/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SignUp from './pages/SignUp/SignUp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/global.css';
import './assets/styles/variables.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [teams, setTeams] = useState([
    { id: 1, name: 'Team A', city: 'Hanoi' },
    { id: 2, name: 'Team B', city: 'Ho Chi Minh' },
    { id: 3, name: 'Team C', city: 'Da Nang' },
  ]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddTeam = (team) => setTeams([...teams, team]);
  const handleEditTeam = (updatedTeam) =>
    setTeams(teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)));
  const handleDeleteTeam = (id) => setTeams(teams.filter((team) => team.id !== id));


  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <Header onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            <div className="content">
              <main>
                <AuthenticatedRoutes
                  teams={teams}
                  onAddTeam={handleAddTeam}
                  onEditTeam={handleEditTeam}
                  onDeleteTeam={handleDeleteTeam}
                />
              </main>
            </div>
            <Footer />
          </>
        ) : (
          <UnauthenticatedRoutes onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

function AuthenticatedRoutes({ teams, onAddTeam, onEditTeam, onDeleteTeam }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/teams"
        element={<Teams teams={teams} onDeleteTeam={onDeleteTeam} />}
      />
      <Route
        path="/teams/add"
        element={<AddTeam onAddTeam={onAddTeam} />}
      />
      <Route
        path="/teams/edit/:id"
        element={<EditTeam teams={teams} onEditTeam={onEditTeam} />}
      />
      <Route path="/teams/:teamId/players" element={<Players />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/standings" element={<Standings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function UnauthenticatedRoutes({ onLogin }) {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
