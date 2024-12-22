const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data for simplicity
let players = {
  "2023-2024": {
    1: [
      {
        id: 1,
        name: 'Cầu thủ A1',
        dob: '1999-03-15',
        position: 'Tiền đạo',
        nationality: 'Việt Nam',
        birthplace: 'Hà Nội',
        height: 180,
        weight: 75,
        bio: 'Một tiền đạo tài năng của đội.',
        season: '2023-2024',
      },
    ],
  },
};

let teams = [
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
];

// Team Routes
app.get('/api/teams', (req, res) => {
  res.json({ teams });
});

app.post('/api/teams', (req, res) => {
  const { team } = req.body;
  const newTeam = { id: Date.now(), ...team };
  teams.push(newTeam);
  res.status(201).json({ message: 'Team added successfully', team: newTeam });
});

app.put('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  const { updatedTeam } = req.body;
  teams = teams.map((team) =>
    team.id === parseInt(id) ? { ...team, ...updatedTeam } : team
  );
  res.json({ message: 'Team updated successfully' });
});

app.delete('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  const teamId = parseInt(id);
  teams = teams.filter((team) => team.id !== teamId);
  res.json({ message: 'Team deleted successfully' });
});

app.get('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  const team = teams.find((team) => team.id === parseInt(id));
  if (team) {
    res.json(team);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

// Player Routes
app.get('/api/players', (req, res) => {
  res.json({ players });
});

app.post('/api/players', (req, res) => {
  const { season, teamId, player } = req.body;
  if (!players[season]) players[season] = {};
  if (!players[season][teamId]) players[season][teamId] = [];
  players[season][teamId].push({ id: Date.now(), ...player });
  res.status(201).json({ message: 'Player added successfully' });
});

app.put('/api/players/:id', (req, res) => {
  const { season, teamId, updatedPlayer } = req.body;
  const { id } = req.params;
  if (!players[season] || !players[season][teamId]) {
    return res.status(404).json({ message: 'Player not found' });
  }
  players[season][teamId] = players[season][teamId].map((player) =>
    player.id === parseInt(id) ? { ...player, ...updatedPlayer } : player
  );
  res.json({ message: 'Player updated successfully' });
});

app.delete('/api/players/:id', (req, res) => {
  const { season, teamId } = req.body;
  const { id } = req.params;
  if (!players[season] || !players[season][teamId]) {
    return res.status(404).json({ message: 'Player not found' });
  }
  players[season][teamId] = players[season][teamId].filter(
    (player) => player.id !== parseInt(id)
  );
  res.json({ message: 'Player deleted successfully' });
});

app.get('/api/players/:id', (req, res) => {
  const { id } = req.params;
  const playerId = parseInt(id);

  for (const season in players) {
    for (const teamId in players[season]) {
      const player = players[season][teamId].find((p) => p.id === playerId);
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
