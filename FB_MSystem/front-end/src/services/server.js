const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const multer = require("multer");
const upload = multer();

app.use(cors());
app.use(express.json());

// In-memory data (replace with a database in a real application)
let availableTeams = [
  {
    id: 1,
    name: "Hà Nội FC",
    city: "Hà Nội",
    coach: "Gad",
    stadium: "Hàng Đẫy",
    stadiumId: 1,
    capacity: 22500,
    fifa_stars: 5,
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
    fifa_stars: 4,
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
    fifa_stars: 4,
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
    fifa_stars: 3,
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
    fifa_stars: 4,
    home_kit_image: "https://upload.wikimedia.org/wikipedia/vi/8/85/Hai_Phong_FC_logo.png",
    away_kit_image: null,
    third_kit_image: null,
    description: "Câu lạc bộ bóng đá Hải Phòng",
    season: null,
  },
];
let teamsBySeason = {
  "2023-2024": [1, 2, 3, 4, 5],
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
      TenSan: "Hàng Đẫy",
      DiaChiSan: "Trịnh Hoài Đức, Cát Linh, Đống Đa, Hà Nội",
      SucChua: 22500,
      TieuChuan: 5,
    },
    {
      stadiumId: 2, 
      TenSan: "Pleiku",
      DiaChiSan: "Đường Quang Trung, Phường Hội Thương, Thành phố Pleiku, Gia Lai",
      SucChua: 12000,
      TieuChuan: 4,
    },
    {
      stadiumId: 3, 
      TenSan: "Gò Đậu",
      DiaChiSan: "Đường 30 Tháng 4, Phú Thọ, Thủ Dầu Một, Bình Dương",
      SucChua: 18250,
      TieuChuan: 3,
    },
    {
      stadiumId: 4, 
      TenSan: "Lạch Tray",
      DiaChiSan: "Đường Chu Văn An, Đằng Giang, Ngô Quyền, Hải Phòng",
      SucChua: 26000,
      TieuChuan: 4,
    },
  ];

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
  app.get("/api/stadiums", (req, res) => {
  res.json(stadiums);
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
  // Tính toán tổng số đội (bao gồm cả các đội chưa có mùa giải)
  const totalTeams = availableTeams.length;

  // Lấy mùa giải gần nhất từ teamsBySeason
  const seasons = Object.keys(teamsBySeason).sort(); // Sắp xếp các mùa giải
  const latestSeason = seasons[seasons.length - 1]; // Lấy mùa giải cuối cùng (mới nhất)

  // Lấy danh sách đội của mùa giải gần nhất
  const teamsInLatestSeason = teamsBySeason[latestSeason]
    ? teamsBySeason[latestSeason]
        .map((teamId) => availableTeams.find((team) => team.id === teamId))
        .filter((team) => team)
    : [];

  // Ví dụ thêm thông tin số bàn thắng cho mỗi đội (cần dữ liệu thực tế)
  const teamsWithGoals = teamsInLatestSeason.map((team) => {
    const goals = calculateGoalsForTeam(team.id, latestSeason);
    return { ...team, goals };
  });

  // Tìm đội có số bàn thắng cao nhất (Vua phá lưới)
  const topScorer = teamsWithGoals.reduce(
    (top, team) => (top.goals > team.goals ? top : team),
    { goals: 0 }
  );

  // Dữ liệu mẫu cho các trận đấu (cần thay thế bằng dữ liệu thực tế)
  const matches = [
    {
      homeTeam: "Team A",
      awayTeam: "Team B",
      played: true,
      homeScore: 2,
      awayScore: 1,
      season: latestSeason,
    },
    {
      homeTeam: "Team C",
      awayTeam: "Team D",
      played: true,
      homeScore: 3,
      awayScore: 3,
      season: latestSeason,
    },
    {
      homeTeam: "Team A",
      awayTeam: "Team C",
      played: false,
      season: latestSeason,
    },
    {
      homeTeam: "Team B",
      awayTeam: "Team D",
      played: false,
      season: latestSeason,
    },
  ];
  for (let i = 0; i < teamsInLatestSeason.length; i++) {
    for (let j = 0; j < teamsInLatestSeason.length; j++) {
      if (i !== j) {
        matches.push({
          homeTeam: teamsInLatestSeason[i].name,
          awayTeam: teamsInLatestSeason[j].name,
          played: false,
          season: latestSeason,
        });
      }
    }
  }
  // Lọc ra các trận đấu đã chơi và chưa chơi
  const completedMatches = matches.filter((match) => match.played).length;
  const upcomingMatches = matches.filter((match) => !match.played).length;

  // Trả về dữ liệu cho Dashboard
  res.json({
    teams: availableTeams, // Sửa lại: trả về tất cả các đội
    matches: matches,
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
  const seasons = Object.keys(teamsBySeason);
  seasons.unshift("all");
  res.json({ seasons: seasons });
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
    if (season && teamsBySeason[season]) {
      const teamsInSeason = teamsBySeason[season]
        .map((teamId) => availableTeams.find((team) => team.id === teamId))
        .filter((team) => team)
        .map((team) => {
          const stadium = stadiums.find((s) => s.stadiumId === team.stadiumId);
          return { ...team, stadium };
        });
      res.json({ teams: teamsInSeason });
    } else {
      res.status(400).json({
        message: "Season parameter is required or season not found",
      });
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
app.put("/api/teams/:id", upload.none(), (req, res) => {
  const { id } = req.params;
  const updatedTeamData = req.body;
  const teamIndex = availableTeams.findIndex((team) => team.id === parseInt(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Update stadium information
  const stadiumId = parseInt(updatedTeamData.stadiumId);
  const stadium = stadiums.find((s) => s.stadiumId === stadiumId);

  if (stadium) {
    updatedTeamData.stadium = stadium.TenSan; 
    updatedTeamData.stadiumId = stadium.stadiumId;
  } else {
    updatedTeamData.stadium = null;
    updatedTeamData.stadiumId = null;
  }

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
    const stadium = stadiums.find((s) => s.stadiumId === team.stadiumId);
    console.log("Team Data:", team);
    console.log("Stadium Data:", stadium);
    res.json({ ...team, stadium });
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
    // Thêm thông tin season và teamId cho mỗi player
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
        // Thêm thông tin season và teamId cho mỗi player
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
  const teamIdNum = Number(teamId); // Convert teamId to a number

  console.log("Received teamId:", teamIdNum); // Log as a number
  console.log("Received season:", season);
  console.log("Received playerIds:", playerIds);

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

  try {
    for (const playerId of playerIds) {
      const playerIdNum = Number(playerId);
      console.log("Processing playerId:", playerIdNum);

      // Find the player in availablePlayers
      const player = availablePlayers.find((p) => p.id === playerIdNum);
      console.log("Found player:", player);

      if (player) {
        // Check if the player already exists in the team for the current season
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
        } else {
          console.log(
            `Player ${playerIdNum} already exists in team ${teamIdNum} for season ${season}`
          );
        }
      } else {
        console.error(`Player with id ${playerIdNum} not found`);
        return res
          .status(404)
          .json({ message: `Player with id ${playerIdNum} not found` });
      }
    }
  } catch (error) {
    console.error("Error in adding players:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  console.log("Players after adding:", players);
  res.status(200).json({
    message: `Players added to season ${season}`,
    updatedPlayers,
  });
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

  // Kiểm tra xem cầu thủ đã được thêm vào đội nào trong mùa giải nào chưa
  let addedToTeam = false;
  for (const season in players) {
    for (const teamId in players[season]) {
      const existingPlayer = players[season][teamId].find(
        (p) => p.id === newPlayer.id
      );
      if (existingPlayer) {
        addedToTeam = true;
        break;
      }
    }
    if (addedToTeam) break;
  }

  // Nếu cầu thủ chưa được thêm vào đội nào, thêm vào "no season"
  if (!addedToTeam) {
    players["no season"] = players["no season"] || {};
    players["no season"]["0"] = players["no season"]["0"] || []; // 0 represents no team
    players["no season"]["0"].push(newPlayer);
  }
  availablePlayers.push(newPlayer);
  res
    .status(201)
    .json({ message: "Player created successfully", player: newPlayer });
});

// Delete a player
app.delete("/api/players/:playerId", (req, res) => {
  const { playerId } = req.params;
  const playerIdInt = parseInt(playerId);

  for (const season in players) {
    for (const teamId in players[season]) {
      players[season][teamId] = players[season][teamId].filter(
        (p) => p.id !== playerIdInt
      );
    }
  }

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

  if (!players[season] || !players[season][teamId]) {
    return res
      .status(404)
      .json({ message: "Player not found in the specified team and season" });
  }

  const playerIndex = players[season][teamId].findIndex(
    (p) => p.id === playerIdInt
  );
  if (playerIndex === -1) {
    return res.status(404).json({ message: "Player not found" });
  }

  players[season][teamId][playerIndex] = {
    ...players[season][teamId][playerIndex],
    ...updatedPlayer,
  };

  res.json({
    message: "Player updated successfully",
    player: players[season][teamId][playerIndex],
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});