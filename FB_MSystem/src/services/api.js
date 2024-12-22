const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

let players = {
    "2023-2024": {
        1: [
            { id: 1, name: 'Cầu thủ A1', dob: '1999-03-15', position: 'Tiền đạo', nationality: 'Việt Nam', birthplace: 'Hà Nội', height: 180, weight: 75, bio: 'Một tiền đạo tài năng của đội.', season: '2023-2024' },
        ],
        2: [
            { id: 2, name: 'Cầu thủ B2', dob: '1998-05-20', position: 'Hậu vệ', nationality: 'Việt Nam', birthplace: 'Hồ Chí Minh', height: 175, weight: 70, bio: 'Một hậu vệ chắc chắn.', season: '2023-2024' },
        ]
    },
    "2022-2023": {
        1: [
            { id: 3, name: 'Cầu thủ C3', dob: '1997-10-10', position: 'Tiền vệ', nationality: 'Việt Nam', birthplace: 'Đà Nẵng', height: 182, weight: 78, bio: 'Một tiền vệ sáng tạo.', season: '2022-2023' },
        ]
    }
};

let teams = [
    { id: 1, name: "Hà Nội FC", city: "Hà Nội", managing_body: "T&T", stadium: "Hàng Đẫy", capacity: 22500, fifa_stars: 3, home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png", away_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png", third_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/f/f7/Logo_Hanoi_FC.svg/1200px-Logo_Hanoi_FC.svg.png", description: "Hà Nội FC description", season: "2023-2024" },
    { id: 2, name: "Hoàng Anh Gia Lai", city: "Pleiku", managing_body: "HAGL", stadium: "Pleiku", capacity: 12000, fifa_stars: 2, home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png", away_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png", third_kit_image: "https://upload.wikimedia.org/wikipedia/vi/thumb/7/77/Hoang_Anh_Gia_Lai_FC_logo.svg/1200px-Hoang_Anh_Gia_Lai_FC_logo.svg.png", description: "HAGL description", season: "2023-2024" },
    { id: 3, name: "Đội Khác", city: "Địa điểm khác", managing_body: "Chủ quản khác", stadium: "Sân vận động khác", capacity: 15000, fifa_stars: 1, home_kit_image: "url_ảnh_1", away_kit_image: "url_ảnh_2", third_kit_image: "url_ảnh_3", description: "Mô tả đội khác", season: "2022-2023" },
];

// Team Routes
app.get('/api/teams', (req, res) => res.json({ teams }));

app.post('/api/teams', (req, res) => {
    const newTeam = { id: Date.now(), ...req.body };
    teams.push(newTeam);
    res.status(201).json({ message: 'Team added successfully', team: newTeam });
});

app.put('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    const updatedTeam = req.body;
    teams = teams.map(team => team.id === parseInt(id) ? { ...team, ...updatedTeam } : team);
    res.json({ message: 'Team updated successfully' });
});

app.delete('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    teams = teams.filter(team => team.id !== parseInt(id));
    res.json({ message: 'Team deleted successfully' });
});

app.get('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    const team = teams.find(team => team.id === parseInt(id));
    if (team) {
        res.json(team);
    } else {
        res.status(404).json({ message: 'Team not found' });
    }
});

// Player Routes (Nested within Team Routes)
app.get('/api/teams/:teamId/players', (req, res) => {
  const { teamId } = req.params;
  const season = req.query.season;
  const teamIdInt = parseInt(teamId);

  if (season) { // Check if season query parameter is present
      if (!players[season] || !players[season][teamIdInt]) {
          return res.json({ players: [] });
      }
      return res.json({ players: players[season][teamIdInt] });
  } else { // If season is not present, return all players regardless of season
      const allPlayers = [];
      for (const seasonKey in players) {
          if (players[seasonKey] && players[seasonKey][teamIdInt]) {
              allPlayers.push(...players[seasonKey][teamIdInt]);
          }
      }
      return res.json({ players: allPlayers });
  }
});

app.post('/api/teams/:teamId/players', (req, res) => {
    const { teamId } = req.params;
    const { season, player } = req.body;

    players[season] = players[season] || {};
    players[season][teamId] = players[season][teamId] || [];

    const newPlayer = { id: Date.now(), ...player };
    players[season][teamId].push(newPlayer);
    res.status(201).json({ message: 'Player added successfully', player: newPlayer });
});

app.put('/api/teams/:teamId/players/:playerId', (req, res) => {
    const { teamId, playerId } = req.params;
    const { season, updatedPlayer } = req.body;

    if (!players[season] || !players[season][teamId]) {
        return res.status(404).json({ message: 'Player not found' });
    }

    const playerIndex = players[season][teamId].findIndex(p => p.id === parseInt(playerId));
    if (playerIndex === -1) {
        return res.status(404).json({ message: 'Player not found' });
    }

    players[season][teamId][playerIndex] = { ...players[season][teamId][playerIndex], ...updatedPlayer };
    res.json({ message: 'Player updated successfully' });
});

app.delete('/api/teams/:teamId/players/:playerId', (req, res) => {
    const { teamId, playerId } = req.params;
    const { season } = req.body;

    if (!players[season] || !players[season][teamId]) {
        return res.status(404).json({ message: 'Player not found' });
    }

    const playerIndex = players[season][teamId].findIndex(p => p.id === parseInt(playerId));
    if (playerIndex === -1) {
        return res.status(404).json({ message: 'Player not found' });
    }

    players[season][teamId].splice(playerIndex, 1);
    res.json({ message: 'Player deleted successfully' });
});
app.get('/api/teams/:teamId/players/:playerId', (req, res) => {
  const { teamId, playerId } = req.params;
  const playerIdInt = parseInt(playerId);
  const teamIdInt = parseInt(teamId);

  for (const season in players) {
      if (players[season] && players[season][teamIdInt]) {
          const player = players[season][teamIdInt].find(p => p.id === playerIdInt);
          if (player) {
              return res.json(player);
          }
      }
  }

  res.status(404).json({ message: 'Player not found in this team' });
});
app.get('/api/players/:playerId', (req, res) => {
  const { playerId } = req.params;
  const playerIdInt = parseInt(playerId);

  for (const season in players) {
      for (const teamId in players[season]) {
          const player = players[season][teamId].find(p => p.id === playerIdInt);
          if (player) {
              return res.json(player);
          }
      }
  }

  res.status(404).json({ message: 'Player not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});