// src/pages/Home/HomePage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

function HomePage( {API_URL } ) {
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
    const [MaMuaGiai, setSelectedSeason] = useState("MG2025_1"); // Mùa giải mặc định

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch league info
                setLeagueInfo({
                    name: "Quản lý đội bóng Quốc gia",
                    link: "https://github.com/leeminsun1205/SE104.P12",
                    format: "Nhập môn Công nghệ phần mềm",
                    startDate: "21/12/2023",
                    endDate: "28/12/2024",
                });

                // Fetch teams for the selected season
                const teamsResponse = await fetch(
                    `http://localhost:5000/mg-db/mua-giai/${MaMuaGiai}/doi-bong`
                );
                if (!teamsResponse.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const teamsData = await teamsResponse.json();
                setTeams(teamsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [MaMuaGiai]); // Depend on selectedSeason

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
                    <Link to="/doi-bong" className={styles.ctaButton}>
                        Xem danh sách đội bóng
                    </Link>
                </header>

                <section className={styles.leagueInfo}>
                    <h2>Thông tin phần mềm</h2>
                    <ul>
                        <li>Tên phần mềm: {leagueInfo.name}</li>
                        <li>Github: {leagueInfo.link}</li>
                        <li>Môn: {leagueInfo.format}</li>
                        <li>
                            Thời gian thực hiện: {leagueInfo.startDate} -{" "}
                            {leagueInfo.endDate}
                        </li>
                    </ul>
                </section>

                {/* Các sections khác nếu cần */}
            </div>
        </div>
    );
}

export default HomePage;