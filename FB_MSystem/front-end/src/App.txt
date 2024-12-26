// -- Updated App.js --
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import CreateTeam from './pages/CreateNew/CreateTeam';
import CreatePlayer from './pages/CreateNew/CreatePlayer';
import CreateStadium from './pages/CreateNew/CreateStadium';
import CreateNew from './pages/CreateNew/CreateNew';
import EditTeam from './pages/Teams/EditTeam';
import TeamInfo from './pages/Teams/TeamInfo';
import Players from './pages/Players/Players';
import PlayerInfo from './pages/Players/PlayerInfo';
import OtherLeagueMatches from './pages/Matches/OtherLeagueMatches';
import Standings from './pages/Standings/Standings';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SignUp from './pages/SignUp/SignUp';
import AllPlayers from './pages/Players/AllPlayers';
import MatchDetails from './pages/Matches/MatchDetails';
import Matches from './pages/Matches/Matches';
import InvoiceForm from './pages/Invoices/InvoiceForm';
import Invoices from "./pages/Invoices/Invoices";
import Temp from './pages/Temp/Temp';
import Settings from './pages/Settings/Settings';
import TypesSettings from './pages/Settings/TypesSettings';
import Stadiums from './pages/Stadiums/Stadiums';
import StadiumInfo from './pages/Stadiums/StadiumInfo';
import SeasonDetails from './pages/Seasons/SeasonDetails';
import CreateSeason from './pages/CreateNew/CreateSeason';
import SeasonList from './pages/Seasons/SeasonList';
import TopScorers from './pages/TopScorers/TopScorers';
import TopScorersStandings from './pages/Standings/TopScorersStandings';
import CombinedStandingsPage from './pages/Standings/CombinedStandingsPage'; 
import SeasonalStandings from './pages/SeasonalStandings/SeasonalStandings'; 
import CardsList from './pages/Standings/CardsList';
import LookUp from './pages/LookUp/LookUp';
import LookUpMatch from './pages/LookUp/LookUpMatch';
import LookUpSeason from './pages/LookUp/LookUpSeason';
import LookUpAchievements from './pages/LookUp/LookUpAchievements';
import PlayerCardList from './pages/PlayerCardList/PlayerCardList';

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
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const seasonsResponse = await fetch(`${API_URL}/seasons`);
                if (!seasonsResponse.ok) {
                    throw new Error(`Failed to fetch seasons: ${seasonsResponse.status}`);
                }
                const seasonsData = await seasonsResponse.json();
                const updatedSeasons = ['all', ...seasonsData.seasons];
                setSeasons(updatedSeasons);

                if (seasonsData.seasons.length > 0) { // Check if there are seasons
                    setSelectedSeason('all');
                    await handleSeasonChange('all');
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSeasonChange = async (newSeason) => {
        if (!newSeason) {
            console.warn("handleSeasonChange called with an empty season value.");
            return;
        }
        setSelectedSeason(newSeason);
        try {
            let teamsResponse;
            if (newSeason === "all") {
                teamsResponse = await fetch(`${API_URL}/teams/all`);
            } else {
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
    const handleAddPlayer = async (newPlayer) => {
        try {
            const response = await fetch(`${API_URL}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlayer),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Player added:", data.player);

        } catch (error) {
            console.error("Error adding player:", error);
        }
    };
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
    const handleAddInvoice = (newInvoice) => {
        setInvoices([...invoices, newInvoice]);
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
                                    API_URL={API_URL} // Pass API_URL down
                                    teams={teams}
                                    seasons={seasons}
                                    selectedSeason={selectedSeason}
                                    onSeasonChange={handleSeasonChange}
                                    onEditTeam={handleEditTeam}
                                    onDeleteTeam={handleDeleteTeam}
                                    invoices={invoices}
                                    onAddInvoice={handleAddInvoice}
                                    handleAddPlayer={handleAddPlayer}
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

function AuthenticatedRoutes({ API_URL, teams, seasons, selectedSeason, onSeasonChange, onEditTeam, onDeleteTeam, invoices, onAddInvoice, handleAddPlayer }) {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/temp" element={<Temp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams"
                element={<Teams
                    teams={teams}
                    API_URL={API_URL}
                    onDeleteTeam={onDeleteTeam} />}
            />
            <Route path="/create/team" element={<CreateTeam API_URL={API_URL} />} />
            <Route path="/create/player" element={<CreatePlayer API_URL={API_URL} onAddPlayer={handleAddPlayer} />} />
            <Route path="/teams/edit/:id" element={<EditTeam onEditTeam={onEditTeam} />} />
            <Route path="/teams/:id" element={<TeamInfo teams={teams} API_URL={API_URL} />} />
            <Route path="/teams/:teamId/players" element={<Players seasons={seasons} />} />
            <Route path="/teams/:teamId/players/:playerId" element={<PlayerInfo />} />
            <Route path="/players" element={<AllPlayers />} />
            <Route path="/players/:playerId" element={<PlayerInfo />} />
            <Route path="/matches" element={<Matches API_URL={API_URL} />} />
            <Route path="/match/:season/:round/:id" element={<MatchDetails API_URL={API_URL} />} />
            <Route path="/standings" element={<Standings API_URL={API_URL} />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/invoices" element={<InvoiceForm API_URL={API_URL} onAddInvoice={onAddInvoice} />} />
            <Route path="/invoices/:invoiceId" element={<Invoices invoices={invoices} />} />
            <Route path="/settings/general" element={<Settings API_URL={API_URL} />} />
            <Route path="/settings/types" element={<TypesSettings API_URL={API_URL} />} />
            <Route path="/stadiums" element={<Stadiums />} />
            <Route path="/create/stadium" element={<CreateStadium />} />
            <Route path="/stadiums/:stadiumId" element={<StadiumInfo />} />
            <Route path="/seasons/:seasonId" element={<SeasonDetails API_URL={API_URL} />} />
            <Route path="/create/season" element={<CreateSeason API_URL={API_URL} />} />
            <Route path="/seasons" element={<SeasonList API_URL={API_URL} />} />
            <Route path="/teams/:teamId/other-matches" element={<OtherLeagueMatches />} /> 
            <Route path="/seasons/:seasonId/top-scorers" element={<TopScorers API_URL={API_URL} />} />
            <Route path="/top-scorers" element={<TopScorersStandings API_URL={API_URL} />} />
            <Route path="/seasons/:seasonId/standings" element={<SeasonalStandings API_URL={API_URL} />} />
            <Route path="/cards" element={<CardsList API_URL={API_URL} />} />
            <Route path="/combined-standings" element={<CombinedStandingsPage API_URL={API_URL} />} /> 
            <Route path="/lookup" element={<LookUp />} />
            <Route path="/lookup/match" element={<LookUpMatch API_URL={API_URL}/>} />
            <Route path="/lookup/season" element={<LookUpSeason API_URL={API_URL}/>} />
            <Route path="/lookup/achievements" element={<LookUpAchievements API_URL={API_URL}/>} />
            <Route path="/player-card-list" element={<PlayerCardList />} />
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