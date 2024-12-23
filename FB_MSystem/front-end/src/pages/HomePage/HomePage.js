// src/pages/Home/HomePage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

function HomePage() {
    const [leagueInfo, setLeagueInfo] = useState({
        name: "",
        season: "",
        numTeams: 0,
        format: "",
        startDate: "",
        endDate: "",
    });
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState("2023-2024"); // Mùa giải mặc định

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch league info
                setLeagueInfo({
                    name: "Giải Bóng đá Vô địch Quốc gia Việt Nam",
                    season: "2023-2024",
                    numTeams: 5,
                    format: "Vòng tròn hai lượt tính điểm",
                    startDate: "01/08/2023",
                    endDate: "31/05/2024",
                });

                // Fetch teams for the selected season
                const teamsResponse = await fetch(
                    `http://localhost:5000/api/seasons/${selectedSeason}/teams`
                );
                if (!teamsResponse.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const teamsData = await teamsResponse.json();
                setTeams(teamsData.teams);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSeason]); // Depend on selectedSeason

    const handleSeasonChange = (newSeason) => {
        setSelectedSeason(newSeason);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.banner}>
                    <h1>
                        Chào mừng đến với Phần mềm Quản lý giải {leagueInfo.name}
                    </h1>
                    <p>
                        Quản lý giải đấu, đội bóng và cầu thủ của bạn một cách dễ
                        dàng.
                    </p>
                    <Link to="/teams" className={styles.ctaButton}>
                        Xem danh sách đội bóng
                    </Link>
                </header>

                <section className={styles.leagueInfo}>
                    <h2>Thông tin giải đấu</h2>
                    <ul>
                        <li>Tên giải đấu: {leagueInfo.name}</li>
                        <li>Mùa giải: {leagueInfo.season}</li>
                        <li>Số đội tham gia: {leagueInfo.numTeams}</li>
                        <li>Thể thức thi đấu: {leagueInfo.format}</li>
                        <li>
                            Thời gian diễn ra: {leagueInfo.startDate} -{" "}
                            {leagueInfo.endDate}
                        </li>
                    </ul>
                </section>

                <section className={styles.teams}>
                    <h2>Các đội bóng tham gia</h2>
                    <ul>
                        {teams.map((team) => (
                            <li key={team.id}>
                                <Link to={`/teams/${team.id}`}>{team.name}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Các sections khác nếu cần */}
            </div>
        </div>
    );
}

export default HomePage;