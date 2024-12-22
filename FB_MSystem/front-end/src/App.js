// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import AddTeam from './pages/Teams/AddTeam';
import EditTeam from './pages/Teams/EditTeam';
import TeamInfo from './pages/Teams/TeamInfo';
import Players from './pages/Players/Players';
import PlayerInfo from './pages/Players/PlayerInfo';
import Matches from './pages/Matches/Matches';
import Standings from './pages/Standings/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SignUp from './pages/SignUp/SignUp';
import Temp from './pages/Temp/Temp';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import './assets/styles/global.css';
import './assets/styles/variables.css';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [teams, setTeams] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/teams`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTeams(data.teams);
                const uniqueSeasons = [...new Set(data.teams.map((team) => team.season))];
                setSeasons(uniqueSeasons);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleAddTeam = async (team) => {
        try {
            const response = await fetch(`${API_URL}/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newTeamData = await response.json();
            setTeams([...teams, newTeamData.team]);
        } catch (error) {
            console.error("Error adding team:", error);
        }
    };

    const handleEditTeam = async (updatedTeam) => {
        try {
            const response = await fetch(`${API_URL}/teams/${updatedTeam.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedTeam }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setTeams((prevTeams) =>
                prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
            );
        } catch (error) {
            console.error("Error updating team:", error)
        }
    };

    const handleDeleteTeam = async (id) => {
        try {
            const response = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setTeams(teams.filter((team) => team.id !== id));
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

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
                                    seasons={seasons}
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

function AuthenticatedRoutes({ teams, seasons, onAddTeam, onEditTeam, onDeleteTeam }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/temp" element={<Temp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Teams teams={teams} seasons={seasons} onDeleteTeam={onDeleteTeam} />} />
            <Route path="/teams/add" element={<AddTeam teams={teams} seasons={seasons} onAddTeam={onAddTeam} />} />
            <Route path="/teams/edit/:id" element={<EditTeam teams={teams} onEditTeam={onEditTeam} />} />
            <Route path="/teams/:id" element={<TeamInfo teams={teams} />} /> {/* Removed key prop */}
            <Route path="/teams/:teamId/players" element={<Players />} /> {/* Needs implementation */}
            <Route path="/teams/:teamId/players/:playerId" element={<PlayerInfo />} /> {/* Needs implementation */}
            <Route path="/matches" element={<Matches />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function UnauthenticatedRoutes({ onLogin }) {
    return (
        <Routes>
            <Route path="/temp" element={<Temp />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;