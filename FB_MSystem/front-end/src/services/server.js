const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let availableTeams = [
  {
    id: 1,
    name: "Hà Nội FC",
    city: "Hà Nội",
    coach: "Gad",
    stadium: "Hàng Đẫy",
    stadiumId: 1,
    capacity: 22500,
    standard: 5,
    home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/e/eb/Hanoi_FC.png",
    away_kit_image: null,
    third_kit_image: null,
    description: "Câu lạc bộ bóng đá Hà Nội",
    season: null,
  },
  {
    id: 2,
    name: "Viettel FC",
    city: "Hà Nội",
    coach: "Tăng Nhất",
    stadium: "Hàng Đẫy",
    stadiumId: 1,
    capacity: 22500,
    standard: 4,
    home_kit_image: null,
    away_kit_image:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/d/d5/Viettel_FC_logo.png/1200px-Viettel_FC_logo.png",
    third_kit_image: null,
    description: "Câu lạc bộ bóng đá Viettel",
    season: null,
  },
  {
    id: 3,
    name: "Hoàng Anh Gia Lai",
    city: "Pleiku",
    coach: "Faigar",
    stadium: "Pleiku",
    stadiumId: 2,
    capacity: 12000,
    standard: 4,
    home_kit_image: null,
    away_kit_image: null,
    third_kit_image:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/7/7d/Hoang_Anh_Gia_Lai_FC_logo.png/1200px-Hoang_Anh_Gia_Lai_FC_logo.png",
    description: "Câu lạc bộ bóng đá Hoàng Anh Gia Lai",
    season: null,
  },
  {
    id: 4,
    name: "Becamex Bình Dương",
    city: "Thủ Dầu Một",
    coach: "Superman",
    stadium: "Gò Đậu",
    stadiumId: 3,
    capacity: 18250,
    standard: 3,
    home_kit_image: null,
    away_kit_image:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/0/07/Becamex_Binh_Duong_FC_logo.png/1200px-Becamex_Binh_Duong_FC_logo.png",
    third_kit_image: null,
    description: "Câu lạc bộ bóng đá Becamex Bình Dương",
    season: null,
  },
  {
    id: 5,
    name: "Hải Phòng",
    city: "Hải Phòng",
    coach: "tslnh",
    stadium: "Lạch Tray",
    stadiumId: 4,
    capacity: 26000,
    standard: 4,
    home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/8/85/Hai_Phong_FC_logo.png",
    away_kit_image: null,
    third_kit_image: null,
    description: "Câu lạc bộ bóng đá Hải Phòng",
    season: null,
  },
];

let seasons = [
  {
    id: "2023-2024",
    name: "Mùa giải 2023-2024",
    startDate: "2023-08-01",
    endDate: "2024-05-30",
    teams: [1, 2, 3, 4, 5],
  },
  {
    id: "2024-2025",
    name: "Mùa giải 2024-2025",
    startDate: "2024-08-01",
    endDate: "2025-05-30",
    teams: [],
  },
];

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
        playerType: "Trong nước",
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
        playerType: "Trong nước",
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
        playerType: "Trong nước",
      },
    ],
  },
};

// Khai báo availablePlayers - Danh sách cầu thủ có sẵn
let availablePlayers = [
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
    playerType: "Trong nước",
  },
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
    playerType: "Trong nước",
  },
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
    playerType: "Trong nước",
  },
];
let stadiums = [
  {
    stadiumId: 1,
    stadiumName: "Hàng Đẫy",
    address: "Trịnh Hoài Đức, Cát Linh, Đống Đa, Hà Nội",
    capacity: 22500,
    standard: 5,
  },
  {
    stadiumId: 2,
    stadiumName: "Pleiku",
    address: "Đường Quang Trung, Phường Hội Thương, Thành phố Pleiku, Gia Lai",
    capacity: 12000,
    standard: 4,
  },
  {
    stadiumId: 3,
    stadiumName: "Gò Đậu",
    address: "Đường 30 Tháng 4, Phú Thọ, Thủ Dầu Một, Bình Dương",
    capacity: 18250,
    standard: 3,
  },
  {
    stadiumId: 4,
    stadiumName: "Lạch Tray",
    address: "Đường Chu Văn An, Đằng Giang, Ngô Quyền, Hải Phòng",
    capacity: 26000,
    standard: 4,
  },
];

// New data structure for matches
let matchesData = [
  {
    matchId: 1,
    season: "2023-2024",
    homeTeamId: 1, // Reference to Hà Nội FC
    awayTeamId: 2, // Reference to Viettel FC
    date: "2023-08-05",
    homeScore: 2,
    awayScore: 1,
  },
  {
    matchId: 2,
    season: "2023-2024",
    homeTeamId: 3, // Reference to Hoàng Anh Gia Lai
    awayTeamId: 4, // Reference to Becamex Bình Dương
    date: "2023-08-06",
    homeScore: 0,
    awayScore: 0,
  },
  // ... more matches
];

// Helper function to get team details with stadium info
const getTeamWithStadium = (teamId) => {
  const team = availableTeams.find((t) => t.id === teamId);
  const stadium = stadiums.find((s) => s.stadiumId === team?.stadiumId);
  return team ? { ...team, stadium } : null;
};

app.get("/api/stadiums", (req, res) => {
  res.json(stadiums);
});

app.get("/api/stadiums/:stadiumId", (req, res) => {
  const { stadiumId } = req.params;
  const stadiumIdNum = parseInt(stadiumId);
  const stadium = stadiums.find((s) => s.stadiumId === stadiumIdNum);
  if (stadium) {
    res.json(stadium);
  } else {
    res.status(404).json({ message: "Stadium not found" });
  }
});
app.post("/api/stadiums", (req, res) => {
  const newStadium = {
    stadiumId:
      stadiums.length > 0
        ? Math.max(...stadiums.map((s) => s.stadiumId)) + 1
        : 1, // Generate a new unique ID
    stadiumName: req.body.stadiumName,
    address: req.body.address,
    capacity: parseInt(req.body.capacity), // Ensure capacity is a number
    standard: parseInt(req.body.standard), // Ensure standard is a number
  };

  stadiums.push(newStadium);
  res
    .status(201)
    .json({ message: "Stadium created successfully", stadium: newStadium });
});

app.put("/api/stadiums/:stadiumId", (req, res) => {
  const { stadiumId } = req.params;
  const stadiumIdNum = parseInt(stadiumId);
  const updatedStadiumData = req.body;
  const stadiumIndex = stadiums.findIndex((s) => s.stadiumId === stadiumIdNum);

  if (stadiumIndex === -1) {
    return res.status(404).json({ message: "Stadium not found" });
  }

  stadiums[stadiumIndex] = {
    ...stadiums[stadiumIndex],
    ...updatedStadiumData,
  };

  res.json({
    message: "Stadium updated successfully",
    stadium: stadiums[stadiumIndex],
  });
});

app.get("/api/dashboard", (req, res) => {
  const totalTeams = availableTeams.length;
  const sortedSeasons = [...seasons].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  const latestSeason = sortedSeasons[0];

  const teamsInLatestSeason = latestSeason
    ? latestSeason.teams
      .map(getTeamWithStadium)
      .filter((team) => team)
    : [];

  const matchesInLatestSeason = latestSeason
    ? matchesData.filter((match) => match.season === latestSeason.id)
    : [];
  const completedMatches = matchesInLatestSeason.filter(
    (match) => match.homeScore !== null && match.awayScore !== null
  ).length;
  const upcomingMatches = matchesInLatestSeason.filter(
    (match) => match.homeScore === null || match.awayScore === null
  ).length;

  const topScorer = teamsInLatestSeason.reduce((top, team) => {
    // Placeholder: Needs actual goal calculation logic
    const goals = calculateGoalsForTeam(team.id, latestSeason.id);
    return goals > (top.goals || 0) ? { name: team.name, goals } : top;
  }, {});

  res.json({
    teams: availableTeams,
    matches: matchesInLatestSeason,
    totalTeams,
    completedMatches,
    upcomingMatches,
    topScorer: topScorer.name ? topScorer : { name: "Chưa xác định", goals: 0 },
  });
});

// Hàm giả lập tính toán số bàn thắng cho mỗi đội
function calculateGoalsForTeam(teamId, season) {
  // TODO: Thay thế bằng logic thực tế để tính số bàn thắng dựa trên dữ liệu trận đấu
  // Ví dụ: Lấy dữ liệu từ một bảng `KETQUATRANDAU` trong database
  const sampleGoals = {
    1: 25,
    2: 20,
    3: 18,
    4: 15,
    5: 12,
  }; // Số bàn thắng giả định cho mỗi đội

  return sampleGoals[teamId] || 0;
}

app.get("/api/seasons", (req, res) => {
  res.json({ seasons: seasons });
});

app.get("/api/seasons/:seasonId", (req, res) => {
  const { seasonId } = req.params;
  const season = seasons.find((s) => s.id === seasonId);
  if (season) {
    res.json(season);
  } else {
    res.status(404).json({ message: "Season not found" });
  }
});

app.post("/api/seasons", (req, res) => {
  const newSeason = {
    id: req.body.name.toLowerCase().replace(/ /g, '-'), // Generate ID from name
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    teams: [],
  };
  seasons.push(newSeason);
  res
    .status(201)
    .json({ message: "Season created successfully", season: newSeason });
});

app.get("/api/teams/all", (req, res) => {
  const allTeamsWithStadiums = availableTeams.map((team) => {
    const stadium = stadiums.find((s) => s.stadiumId === team.stadiumId);
    return { ...team, stadium };
  });

  res.json({ teams: allTeamsWithStadiums });
});

app.get("/api/teams", (req, res) => {
  const season = req.query.season;
  if (season === 'all') {
    const allTeamsWithStadiums = availableTeams.map((team) => {
      const stadium = stadiums.find((s) => s.stadiumId === team.stadiumId);
      return { ...team, stadium };
    });
    return res.json({ teams: allTeamsWithStadiums });
  }
  if (season) {
    const selectedSeason = seasons.find(s => s.id === season);
    if (selectedSeason) {
      const teamsInSeason = selectedSeason.teams
        .map(getTeamWithStadium)
        .filter((team) => team);
      res.json({ teams: teamsInSeason });
    } else {
      res.status(404).json({ message: "Season not found" });
    }
  } else {
    res
      .status(400)
      .json({ message: "Season parameter is required or season not found" });
  }
});

app.post("/api/teams/available", (req, res) => {
  const newTeam = { id: Date.now(), ...req.body, season: null };
  availableTeams.push(newTeam);
  res
    .status(201)
    .json({ message: "Team created successfully", team: { ...newTeam, stadium: stadiums.find(s => s.stadiumId === newTeam.stadiumId) } });
});

app.get("/api/teams/available", (req, res) => {
  const availableTeamsOnly = availableTeams.filter((team) => !team.season).map(team => ({
    ...team,
    stadium: stadiums.find(s => s.stadiumId === team.stadiumId)
  }));
  res.json({ teams: availableTeamsOnly });
});

app.post("/api/seasons/:seasonId/teams", (req, res) => {
  const { seasonId } = req.params;
  const { teamIds } = req.body;

  if (!Array.isArray(teamIds)) {
    return res.status(400).json({ message: "teamIds must be an array" });
  }

  const season = seasons.find((s) => s.id === seasonId);
  if (!season) {
    return res.status(404).json({ message: `Season ${seasonId} not found` });
  }

  const updatedTeams = [];

  teamIds.forEach((teamId) => {
    const teamIdNum = Number(teamId);
    const team = availableTeams.find((t) => t.id === teamIdNum);
    if (team) {
      if (!season.teams.includes(teamIdNum)) {
        season.teams.push(teamIdNum);
      }
      updatedTeams.push(getTeamWithStadium(teamIdNum));
    }
  });

  res.status(200).json({
    message: `Teams added to season ${seasonId}`,
    updatedTeams,
  });
});

app.get("/api/seasons/:seasonId/teams", (req, res) => {
  const { seasonId } = req.params;
  const season = seasons.find((s) => s.id === seasonId);
  const teamsInSeason =
    season?.teams
      ?.map(getTeamWithStadium)
      .filter((team) => team) || [];
  res.json({ teams: teamsInSeason });
});
app.put("/api/teams/:id", upload.none(), (req, res) => {
  const { id } = req.params;
  const updatedTeamData = req.body;
  const teamIndex = availableTeams.findIndex((team) => team.id === parseInt(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: "Team not found" });
  }

  availableTeams[teamIndex] = {
    ...availableTeams[teamIndex],
    ...updatedTeamData,
  };

  res.json({
    message: "Team updated successfully",
    team: getTeamWithStadium(parseInt(id)),
  });
});

// Delete a team
app.delete("/api/teams/:id", (req, res) => {
  const { id } = req.params;
  const teamId = parseInt(id);

  // Remove the team from availableTeams
  availableTeams = availableTeams.filter((team) => team.id !== teamId);

  // Remove the team from all seasons
  seasons.forEach(season => {
    season.teams = season.teams.filter(teamIdInSeason => teamIdInSeason !== teamId);
  });

  // Remove the team from players data
  for (const seasonKey in players) {
    delete players[seasonKey][teamId];
  }

  // Remove the team from matches
  matchesData = matchesData.filter(match => match.homeTeamId !== teamId && match.awayTeamId !== teamId);

  res.json({ message: "Team deleted successfully" });
});

// Get a specific team
app.get("/api/teams/:id", (req, res) => {
  const { id } = req.params;
  const team = availableTeams.find((team) => team.id === parseInt(id));
  if (team) {
    res.json(getTeamWithStadium(parseInt(id)));
  } else {
    res.status(404).json({ message: "Team not found" });
  }
});

// New endpoint to get teams not in a specific season (Might not be needed)
app.get("/api/teams/not-in-season/:season", (req, res) => {
  const { season } = req.params;
  const selectedSeason = seasons.find(s => s.id === season);
  const teamsNotInSeason = selectedSeason
    ? availableTeams.filter((team) => !selectedSeason.teams.includes(team.id))
    : [];
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
    const teamPlayers = players[season][teamIdInt].map((player) => ({
      ...player,
      season: season,
      teamId: teamId,
    }));
    return res.json({ players: teamPlayers });
  } else {
    const allPlayers = [];
    for (const seasonKey in players) {
      if (players[seasonKey] && players[seasonKey][teamIdInt]) {
        const teamPlayers = players[seasonKey][teamIdInt].map((player) => ({
          ...player,
          season: seasonKey,
          teamId: teamId,
        }));
        allPlayers.push(...teamPlayers);
      }
    }
    return res.json({ players: allPlayers });
  }
});

// Sửa lại app.post để sử dụng playerIds và tìm cầu thủ trong availablePlayers
app.post("/api/teams/:teamId/players", (req, res) => {
  const { teamId } = req.params;
  const { season, playerIds } = req.body;
  const teamIdNum = Number(teamId);

  if (!Array.isArray(playerIds)) {
    return res.status(400).json({ message: "playerIds must be an array" });
  }

  if (playerIds.length === 0) {
    return res.status(400).json({ message: "playerIds must not be empty" });
  }

  if (!players[season]) {
    players[season] = {};
  }

  if (!players[season][teamIdNum]) {
    players[season][teamIdNum] = [];
  }

  const updatedPlayers = [];

  for (const playerId of playerIds) {
    const playerIdNum = Number(playerId);

    const player = availablePlayers.find((p) => p.id === playerIdNum);

    if (player) {
      const playerExists = players[season][teamIdNum].some(
        (p) => p.id === playerIdNum
      );
      if (!playerExists) {
        players[season][teamIdNum].push({
          ...player,
          season: season,
          teamId: teamIdNum,
        });
        updatedPlayers.push({
          ...player,
          season: season,
          teamId: teamIdNum,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: `Player with id ${playerIdNum} not found` });
    }
  }

  res.status(200).json({
    message: `Players added to season ${season}`,
    updatedPlayers,
  });
});

app.put("/api/teams/:teamId/players/:playerId", (req, res) => {
  const { teamId, playerId } = req.params;
  const { season, updatedPlayer } = req.body;
  const teamIdInt = parseInt(teamId);
  const playerIdInt = parseInt(playerId);

  if (!players[season] || !players[season][teamIdInt]) {
    return res.status(404).json({ message: "Player not found" });
  }

  const playerIndex = players[season][teamIdInt].findIndex(
    (p) => p.id === playerIdInt
  );
  if (playerIndex === -1) {
    return res.status(404).json({ message: "Player not found" });
  }

  players[season][teamIdInt][playerIndex] = {
    ...players[season][teamIdInt][playerIndex],
    ...updatedPlayer,
  };
  res.json({ message: "Player updated successfully" });
});

app.delete("/api/teams/:teamId/players/:playerId", (req, res) => {
  const { teamId, playerId } = req.params;
  const { season } = req.body;
  const teamIdInt = parseInt(teamId);
  const playerIdInt = parseInt(playerId);

  if (!players[season] || !players[season][teamIdInt]) {
    return res.status(404).json({ message: "Player not found" });
  }

  const playerIndex = players[season][teamIdInt].findIndex(
    (p) => p.id === playerIdInt
  );
  if (playerIndex === -1) {
    return res.status(404).json({ message: "Player not found" });
  }

  players[season][teamIdInt].splice(playerIndex, 1);
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
        return res.json({ ...player, season, teamId });
      }
    }
  }

  res.status(404).json({ message: "Player not found in this team" });
});
app.get("/api/players", (req, res) => {
  const allPlayers = [];
  for (const season in players) {
    for (const teamId in players[season]) {
      const teamPlayers = players[season][teamId].map((player) => ({
        ...player,
        season: season,
        teamId: teamId,
      }));
      allPlayers.push(...teamPlayers);
    }
  }
  res.json(allPlayers);
});
app.post("/api/players", (req, res) => {
  const newPlayer = { id: Date.now(), ...req.body };
  availablePlayers.push(newPlayer);
  res
    .status(201)
    .json({ message: "Player created successfully", player: newPlayer });
});

// Delete a player
app.delete("/api/players/:playerId", (req, res) => {
  const { playerId } = req.params;
  const playerIdInt = parseInt(playerId);

  // Remove player from all team rosters
  for (const season in players) {
    for (const teamId in players[season]) {
      players[season][teamId] = players[season][teamId].filter(
        (p) => p.id !== playerIdInt
      );
    }
  }

  // Remove player from available players
  availablePlayers = availablePlayers.filter((p) => p.id !== playerIdInt);

  res.json({ message: "Player deleted successfully" });
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
        return res.json({ ...player, season, teamId });
      }
    }
  }

  res.status(404).json({ message: "Player not found" });
});
app.put("/api/players/:playerId", (req, res) => {
  const { playerId } = req.params;
  const { season, teamId, updatedPlayer } = req.body;
  const playerIdInt = parseInt(playerId);
  const teamIdInt = parseInt(teamId);

  if (!players[season] || !players[season][teamIdInt]) {
    return res
      .status(404)
      .json({ message: "Player not found in the specified team and season" });
  }

  const playerIndex = players[season][teamIdInt].findIndex(
    (p) => p.id === playerIdInt
  );
  if (playerIndex === -1) {
    return res.status(404).json({ message: "Player not found" });
  }

  players[season][teamIdInt][playerIndex] = {
    ...players[season][teamIdInt][playerIndex],
    ...updatedPlayer,
  };

  res.json({
    message: "Player updated successfully",
    player: players[season][teamIdInt][playerIndex],
  });
});

app.get("/api/standings", (req, res) => {
  const season = req.query.season;
  if (!season) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp tham số mùa giải." });
  }

  const seasonData = seasons.find(s => s.id === season);
  if (!seasonData) {
    return res.status(404).json({ message: `Không tìm thấy mùa giải ${season}.` });
  }

  const teamsInSeason = seasonData.teams
    ? seasonData.teams.map((id) =>
      availableTeams.find((team) => team.id === id)
    )
    : [];

  if (!teamsInSeason || teamsInSeason.length === 0) {
    return res
      .status(404)
      .json({ message: `Không tìm thấy đội nào cho mùa giải ${season}.` });
  }

  const standings = teamsInSeason.reduce((acc, team) => {
    acc[team.id] = {
      id: team.id,
      name: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      season: season,
    };
    return acc;
  }, {});

  const matchesForSeason = matchesData.filter((match) => match.season === season);

  matchesForSeason.forEach((match) => {
    const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

    if (standings[homeTeamId]) {
      standings[homeTeamId].played++;
      standings[homeTeamId].goalsFor += homeScore;
      standings[homeTeamId].goalsAgainst += awayScore;
    }
    if (standings[awayTeamId]) {
      standings[awayTeamId].played++;
      standings[awayTeamId].goalsFor += awayScore;
      standings[awayTeamId].goalsAgainst += homeScore;
    }

    if (homeScore > awayScore) {
      if (standings[homeTeamId]) standings[homeTeamId].won++;
      if (standings[homeTeamId]) standings[homeTeamId].points += 3;
      if (standings[awayTeamId]) standings[awayTeamId].lost++;
    } else if (awayScore > homeScore) {
      if (standings[awayTeamId]) standings[awayTeamId].won++;
      if (standings[awayTeamId]) standings[awayTeamId].points += 3;
      if (standings[homeTeamId]) standings[homeTeamId].lost++;
    } else {
      if (standings[homeTeamId]) standings[homeTeamId].drawn++;
      if (standings[homeTeamId]) standings[homeTeamId].points += 1;
      if (standings[awayTeamId]) standings[awayTeamId].drawn++;
      if (standings[awayTeamId]) standings[awayTeamId].points += 1;
    }
  });

  const standingsArray = Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.goalsFor - a.goalsFor;
  });

  const rankedStandings = standingsArray.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));

  res.json(rankedStandings);
});

app.post("/api/matches", (req, res) => {
  const newMatch = {
    matchId: matchesData.length > 0 ? Math.max(...matchesData.map(m => m.matchId)) + 1 : 1,
    season: req.body.season,
    homeTeamId: parseInt(req.body.homeTeamId),
    awayTeamId: parseInt(req.body.awayTeamId),
    date: req.body.date,
    homeScore: null,
    awayScore: null,
  };
  matchesData.push(newMatch);
  res.status(201).json({ message: "Match created", match: newMatch });
});

app.put("/api/matches/:matchId", (req, res) => {
  const { matchId } = req.params;
  const matchIdNum = parseInt(matchId);
  const updatedMatchData = req.body;

  const matchIndex = matchesData.findIndex((m) => m.matchId === matchIdNum);
  if (matchIndex === -1) {
    return res.status(404).json({ message: "Match not found" });
  }

  matchesData[matchIndex] = {
    ...matchesData[matchIndex],
    ...updatedMatchData,
  };
  res.json({ message: "Match updated", match: matchesData[matchIndex] });
});
app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  console.log('Received settings from frontend:', newSettings);
  res.status(200).json({ message: 'Settings saved successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});