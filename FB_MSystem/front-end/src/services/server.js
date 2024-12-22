const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data (replace with a database in a real application)
let availableTeams = []; // Teams not yet assigned to a season
let teamsBySeason = {
    "2023-2024": [],
    "2024-2025": [],
};
let players = {
    "2023-2024": {
        1: [
            {
                id: 1,
                name: "Cầu thủ A1",
                dob: "1999-03-15",
                position: "Tiền đạo",
                nationality: "Việt Nam",
                birthplace: "Hà Nội",
                height: 180,
                weight: 75,
                bio: "Một tiền đạo tài năng của đội.",
                season: "2023-2024",
            },
        ],
        2: [
            {
                id: 2,
                name: "Cầu thủ B2",
                dob: "1998-05-20",
                position: "Hậu vệ",
                nationality: "Việt Nam",
                birthplace: "Hồ Chí Minh",
                height: 175,
                weight: 70,
                bio: "Một hậu vệ chắc chắn.",
                season: "2023-2024",
            },
        ],
    },
    "2022-2023": {
        1: [
            {
                id: 3,
                name: "Cầu thủ C3",
                dob: "1997-10-10",
                position: "Tiền vệ",
                nationality: "Việt Nam",
                birthplace: "Đà Nẵng",
                height: 182,
                weight: 78,
                bio: "Một tiền vệ sáng tạo.",
                season: "2022-2023",
            },
        ],
    },
};

app.get("/api/seasons", (req, res) => {
    const seasons = Object.keys(teamsBySeason);
    seasons.unshift("all");
    res.json({ seasons: seasons });
});

app.get('/api/teams/all', (req, res) => {
    const allTeams = [];
  
    for (const season in teamsBySeason) {
      const teamIds = teamsBySeason[season];
  
      teamIds.forEach((teamId) => {
        const team = availableTeams.find((t) => t.id === teamId);
        if (team) {
          const teamExists = allTeams.some((existingTeam) => existingTeam.id === team.id);
          if (!teamExists) {
            allTeams.push({ ...team, season });
          }
        }
      });
    }
  
    res.json({ teams: allTeams });
  });


app.get("/api/teams", (req, res) => {
    const season = req.query.season;
    if (season && teamsBySeason[season]) {
        const teamsInSeason = teamsBySeason[season]
            .map((teamId) => availableTeams.find((team) => team.id === teamId))
            .filter((team) => team);
        res.json({ teams: teamsInSeason });
    } else {
        res.status(400).json({ message: "Season parameter is required or season not found" });
    }
});


app.post("/api/teams/available", (req, res) => {
    console.log("Request Body:", req.body);
    const newTeam = { id: Date.now(), ...req.body, season: null };
    console.log("New Team Object:", newTeam);
    availableTeams.push(newTeam);
    res.status(201).json({ message: "Team created successfully", team: newTeam });
});

app.get("/api/teams/available", (req, res) => {
    const availableTeamsOnly = availableTeams.filter((team) => !team.season);
    res.json({ teams: availableTeamsOnly });
});

app.post("/api/seasons/:seasonId/teams", (req, res) => {
    const { seasonId } = req.params;
    const { teamIds } = req.body;

    console.log("Received seasonId:", seasonId);
    console.log("Received teamIds:", teamIds); 

    if (!Array.isArray(teamIds)) {
        return res.status(400).json({ message: "teamIds must be an array" });
    }

    if (!teamsBySeason[seasonId]) {
        teamsBySeason[seasonId] = [];
    }

    const updatedTeams = [];

    teamIds.forEach((teamId) => {
        const teamIdNum = Number(teamId);
        const team = availableTeams.find((t) => t.id === teamIdNum);
        if (team) {
            if (!teamsBySeason[seasonId].includes(teamIdNum)) {
                teamsBySeason[seasonId].push(teamIdNum);
            }

            updatedTeams.push(team);
        }
    });

    res.status(200).json({
        message: `Teams added to season ${seasonId}`,
        updatedTeams,
    });
});


app.get("/api/seasons/:seasonId/teams", (req, res) => {
    const { seasonId } = req.params;
    const teamsInSeason =
        teamsBySeason[seasonId]
            ?.map((teamId) => availableTeams.find((team) => team.id === teamId))
            .filter((team) => team) || []; 
    res.json({ teams: teamsInSeason });
});

// Update a team
app.put("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    const updatedTeamData = req.body;
    const teamIndex = availableTeams.findIndex(
        (team) => team.id === parseInt(id)
    );

    if (teamIndex === -1) {
        return res.status(404).json({ message: "Team not found" });
    }

    // Update the team in availableTeams
    availableTeams[teamIndex] = {
        ...availableTeams[teamIndex],
        ...updatedTeamData,
    };

    res.json({
        message: "Team updated successfully",
        team: availableTeams[teamIndex],
    });
});

// Delete a team
app.delete("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    const teamId = parseInt(id);

    // Remove the team from availableTeams
    availableTeams = availableTeams.filter((team) => team.id !== teamId);

    // Remove the team from all seasons in teamsBySeason
    for (const season in teamsBySeason) {
        teamsBySeason[season] = teamsBySeason[season].filter(
            (id) => id !== teamId
        );
    }

    res.json({ message: "Team deleted successfully" });
});

// Get a specific team
app.get("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    const team = availableTeams.find((team) => team.id === parseInt(id));
    if (team) {
        res.json(team);
    } else {
        res.status(404).json({ message: "Team not found" });
    }
});

// New endpoint to get teams not in a specific season (Might not be needed)
app.get("/api/teams/not-in-season/:season", (req, res) => {
    const { season } = req.params;
    const teamsNotInSeason = availableTeams.filter(
        (team) => team.season !== season
    );
    res.json({ teams: teamsNotInSeason });
});

// Player Routes (Nested within Team Routes)
app.get("/api/teams/:teamId/players", (req, res) => {
    const { teamId } = req.params;
    const season = req.query.season;
    const teamIdInt = parseInt(teamId);

    if (season) {
        if (!players[season] || !players[season][teamIdInt]) {
            return res.json({ players: [] });
        }
        return res.json({ players: players[season][teamIdInt] });
    } else {
        const allPlayers = [];
        for (const seasonKey in players) {
            if (players[seasonKey] && players[seasonKey][teamIdInt]) {
                allPlayers.push(...players[seasonKey][teamIdInt]);
            }
        }
        return res.json({ players: allPlayers });
    }
});

app.post("/api/teams/:teamId/players", (req, res) => {
    const { teamId } = req.params;
    const { season, player } = req.body;

    players[season] = players[season] || {};
    players[season][teamId] = players[season][teamId] || [];

    const newPlayer = { id: Date.now(), ...player };
    players[season][teamId].push(newPlayer);
    res.status(201).json({ message: "Player added successfully", player: newPlayer });
});

app.put("/api/teams/:teamId/players/:playerId", (req, res) => {
    const { teamId, playerId } = req.params;
    const { season, updatedPlayer } = req.body;

    if (!players[season] || !players[season][teamId]) {
        return res.status(404).json({ message: "Player not found" });
    }

    const playerIndex = players[season][teamId].findIndex(
        (p) => p.id === parseInt(playerId)
    );
    if (playerIndex === -1) {
        return res.status(404).json({ message: "Player not found" });
    }

    players[season][teamId][playerIndex] = {
        ...players[season][teamId][playerIndex],
        ...updatedPlayer,
    };
    res.json({ message: "Player updated successfully" });
});

app.delete("/api/teams/:teamId/players/:playerId", (req, res) => {
    const { teamId, playerId } = req.params;
    const { season } = req.body;

    if (!players[season] || !players[season][teamId]) {
        return res.status(404).json({ message: "Player not found" });
    }

    const playerIndex = players[season][teamId].findIndex(
        (p) => p.id === parseInt(playerId)
    );
    if (playerIndex === -1) {
        return res.status(404).json({ message: "Player not found" });
    }

    players[season][teamId].splice(playerIndex, 1);
    res.json({ message: "Player deleted successfully" });
});
app.get("/api/teams/:teamId/players/:playerId", (req, res) => {
    const { teamId, playerId } = req.params;
    const playerIdInt = parseInt(playerId);
    const teamIdInt = parseInt(teamId);

    for (const season in players) {
        if (players[season] && players[season][teamIdInt]) {
            const player = players[season][teamIdInt].find(
                (p) => p.id === playerIdInt
            );
            if (player) {
                return res.json(player);
            }
        }
    }

    res.status(404).json({ message: "Player not found in this team" });
});

app.get("/api/players/:playerId", (req, res) => {
    const { playerId } = req.params;
    const playerIdInt = parseInt(playerId);

    for (const season in players) {
        for (const teamId in players[season]) {
            const player = players[season][teamId].find(
                (p) => p.id === playerIdInt
            );
            if (player) {
                return res.json(player);
            }
        }
    }

    res.status(404).json({ message: "Player not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});