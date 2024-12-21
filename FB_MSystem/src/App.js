import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import AddTeam from './pages/Teams/AddTeam';
import EditTeam from './pages/Teams/EditTeam';
import TeamInfo from './pages/Teams/TeamInfo'; // Import TeamInfo
import Players from './pages/Players/Players';
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

const initialTeams = [
    {
        id: 1,
        name: "Hà Nội FC",
        city: "Hà Nội",
        managing_body: "T&T",
        stadium: "Hàng Đẫy",
        capacity: 22500,
        fifa_stars: 3,
        home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png",
        away_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png",
        third_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png",
        description: "Hà Nội FC description",
        season: "2023-2024",
    },
    {
        id: 2,
        name: "Hoàng Anh Gia Lai",
        city: "Pleiku",
        managing_body: "HAGL",
        stadium: "Pleiku",
        capacity: 12000,
        fifa_stars: 2,
        home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png",
        away_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png",
        third_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png",
        description: "HAGL description",
        season: "2022-2023",
    },
];
const seasons = [...new Set(initialTeams.map((team) => team.season))];

function App() {
    const [teams, setTeams] = useState(initialTeams);
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleAddTeam = (team) => setTeams([...teams, team]);
    const handleEditTeam = (updatedTeam) => {
        setTeams((prevTeams) => 
            prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        );
    };
    
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
            <Route
                path="/teams"
                
                element={<Teams teams={teams} seasons={seasons} onDeleteTeam={onDeleteTeam} />}
            />
            <Route
                path="/teams/add"
                element={<AddTeam teams={teams} seasons={seasons} onAddTeam={onAddTeam} />}
            />
            <Route path="/teams/edit/:id" element={<EditTeam teams={teams} onEditTeam={onEditTeam} />} />
            <Route path="/teams/:id" element={<TeamInfo teams={teams} key={Date.now()} />} />
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
            <Route path="/temp" element={<Temp />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
