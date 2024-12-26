// CombinedStandingsPage.js
import React, { useState } from 'react';
import Standings from './Standings';
import TopScorersStandings from './TopScorersStandings';
import CardsList from './CardsList'; 
import styles from './CombinedStandingsPage.module.css'; // Import CSS module

function CombinedStandingsPage({ API_URL }) {
    const [showStandings, setShowStandings] = useState(true);
    const [showTopScorers, setShowTopScorers] = useState(false);
    const [showCardsList, setShowCardsList] = useState(false);

    const handleToggleView = (view) => {
        setShowStandings(view === 'standings');
        setShowTopScorers(view === 'topScorers');
        setShowCardsList(view === 'cards');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
            <div className={styles.buttonGroup}>
                <button
                    onClick={() => handleToggleView('standings')}
                    className={`${styles.button} ${showStandings ? styles.active : ''}`}
                >
                    Bảng xếp hạng
                </button>
                <button
                    onClick={() => handleToggleView('topScorers')}
                    className={`${styles.button} ${showTopScorers ? styles.active : ''}`}
                >
                    Vua phá lưới
                </button>
                <button
                    onClick={() => handleToggleView('cards')}
                    className={`${styles.button} ${showCardsList ? styles.active : ''}`}
                >
                    Danh sách thẻ phạt
                </button>
            </div>
                {showStandings && <Standings API_URL={API_URL} />}
                {showTopScorers && <TopScorersStandings API_URL={API_URL} />}
                {showCardsList && <CardsList API_URL={API_URL} />}
            </div>
        </div>
    );
}

export default CombinedStandingsPage;