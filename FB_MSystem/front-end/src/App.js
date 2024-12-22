import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import CreateTeam from './pages/Teams/CreateTeam';
import CreatePlayer from './pages/Players/CreatePlayer';
import CreateNew from './pages/CreateNew/CreateNew';
import EditTeam from './pages/Teams/EditTeam';
import TeamInfo from './pages/Teams/TeamInfo';
import Players from './pages/Players/Players';
import PlayerInfo from './pages/Players/PlayerInfo';
import OtherLeagueMatches from './pages/Teams/OtherLeagueMatches';
import Standings from './pages/Standings/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SignUp from './pages/SignUp/SignUp';
import MatchDetails from './pages/Matches/MatchDetails';
import Matches from './pages/Matches/Matches';
import Invoices from './pages/Invoices/Invoices';
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
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherMatches, setOtherMatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch available seasons
                const seasonsResponse = await fetch(`${API_URL}/seasons`);
                if (!seasonsResponse.ok) {
                    throw new Error(`Failed to fetch seasons: ${seasonsResponse.status}`);
                }
                const seasonsData = await seasonsResponse.json();

                // Add 'all' to the beginning of the seasons array
                const updatedSeasons = ['all', ...seasonsData.seasons];
                setSeasons(updatedSeasons);

                // Set the default season to 'all'
                setSelectedSeason('all');

                // Fetch teams for the default season
                await handleSeasonChange('all');
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSeasonChange = async (newSeason) => {
        setSelectedSeason(newSeason);
        try {
            let teamsResponse;
            if (newSeason === "all") {
                // Fetch all teams when 'all' is selected
                teamsResponse = await fetch(`${API_URL}/teams/all`);
            } else {
                // Fetch teams for a specific season
                teamsResponse = await fetch(`${API_URL}/teams?season=${newSeason}`);
            }
            if (!teamsResponse.ok) {
                throw new Error(`HTTP error! status: ${teamsResponse.status}`);
            }
            const data = await teamsResponse.json();
            setTeams(data.teams);
        } catch (error) {
            console.error("Error fetching teams for new season:", error);
            setError(error);
        }
    };

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleEditTeam = async (updatedTeam) => {
        try {
            const response = await fetch(`${API_URL}/teams/${updatedTeam.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTeam),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedTeamData = await response.json();

            // Update the teams array with the updated team data
            setTeams((prevTeams) =>
                prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeamData.team : team))
            );
        } catch (error) {
            console.error("Error updating team:", error);
        }
    };

    const handleDeleteTeam = async (id) => {
        try {
            const response = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the team from the teams array
            setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
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
                        <Sidebar isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
                        <div className="content">
                            <main>
                                <AuthenticatedRoutes
                                    teams={teams}
                                    seasons={seasons}
                                    selectedSeason={selectedSeason}
                                    onSeasonChange={handleSeasonChange}
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
function AuthenticatedRoutes({ teams, seasons, selectedSeason, onSeasonChange, onAddTeam, onEditTeam, onDeleteTeam, otherMatches }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/temp" element={<Temp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams"
                element={<Teams
                    teams={teams}
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={onSeasonChange}
                    onDeleteTeam={onDeleteTeam} />}
            />
            <Route path="/create/team" element={<CreateTeam />} />
            <Route path="/create/player" element={<CreatePlayer />} />
            <Route path="/teams/edit/:id" element={<EditTeam onEditTeam={onEditTeam} />} />
            <Route path="/teams/:id" element={<TeamInfo teams={teams} otherMatches={otherMatches} />} />
            <Route path="/teams/:teamId/players" element={<Players seasons={seasons} />} />
            <Route path="/teams/:teamId/players/:playerId" element={<PlayerInfo />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/match/:season/:round/:id" element={<MatchDetails />} />
            <Route path="/teams/:id/other-matches" element={<OtherLeagueMatches teams={teams} otherMatches={otherMatches} />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/invoices" element={<Invoices />} />
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