// CombinedStandingsPage.js
import React, { useState } from 'react';
import Standings from './Standings';
import TopScorersStandings from './TopScorersStandings';
import styles from './CombinedStandingsPage.module.css'; // Import CSS module

function CombinedStandingsPage({ API_URL }) {
    const [showStandings, setShowStandings] = useState(true);

    const handleToggleView = (view) => {
        console.log('handleToggleView called with:', view);
        setShowStandings(view === 'standings');
        console.log('showStandings is now:', view === 'standings');
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
                    className={`${styles.button} ${!showStandings ? styles.active : ''}`}
                >
                    Vua phá lưới
                </button>
            </div>
                {console.log('Rendering content with showStandings:', showStandings)}
                {showStandings && <Standings API_URL={API_URL} />}
                {!showStandings && <TopScorersStandings API_URL={API_URL} />}
            </div>
        </div>
    );
}

export default CombinedStandingsPage;