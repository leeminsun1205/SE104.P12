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

// Routes
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

