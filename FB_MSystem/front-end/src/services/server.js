const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const app = express();
const PORT = 5000;

let {
  availableTeams,
  seasons,
  players,
  availablePlayers,
  stadiums,
  matchesData,
  typeSettings,
  settingsData,
  teamsPosition,
  playerCards
} = require("./data");

app.use(cors());
app.use(express.json());

const getTeamWithStadium = (teamId) => {
  const team = availableTeams.find((t) => t.id === teamId);
  const stadium = stadiums.find((s) => s.stadiumId === team?.stadiumId);
  return team ? { ...team, stadium } : null;
};

const getTeamName = (teamId) => {
  const team = availableTeams.find((t) => t.id === teamId);
  return team ? team.name : "Unknown Team";
};

const getStadiumName = (stadiumId) => {
  const stadium = stadiums.find((s) => s.stadiumId === stadiumId);
  return stadium ? stadium.stadiumName : "Unknown Stadium";
};

const getRoundName = (seasonId, roundId) => {
  const season = seasons.find(s => s.id === seasonId);
  const round = season?.rounds.find(r => r.roundId === roundId);
  return round ? round.name : "Unknown Round";
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

app.delete("/api/stadiums/:stadiumId", (req, res) => {
  const { stadiumId } = req.params;
  const stadiumIdNum = parseInt(stadiumId);
  const initialLength = stadiums.length;

  // Tìm xem có team nào đang sử dụng stadium này không
  const teamsUsingStadium = availableTeams.filter(team => team.stadiumId === stadiumIdNum);

  if (teamsUsingStadium.length > 0) {
    return res.status(400).json({
      message: "Không thể xóa sân vận động đang được sử dụng bởi các đội.",
      teams: teamsUsingStadium.map(team => team.name)
    });
  }

  stadiums = stadiums.filter((s) => s.stadiumId !== stadiumIdNum);

  if (stadiums.length < initialLength) {
    res.json({ message: "Stadium deleted successfully" });
  } else {
    res.status(404).json({ message: "Stadium not found" });
  }
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

  // Cải thiện: Implement logic thực tế để tính số bàn thắng cho đội
  const topScorer = teamsInLatestSeason.reduce((top, team) => {
    let goals = 0;
    matchesInLatestSeason.forEach(match => {
      if (match.homeTeamId === team.id && match.goals) {
        goals += match.goals.filter(g => g.team === team.id).length;
      } else if (match.awayTeamId === team.id && match.goals) {
        goals += match.goals.filter(g => g.team === team.id).length;
      }
    });
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
    rounds: [], // Initialize rounds array
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
    const teamIdNum = parseInt(teamId);
    const team = availableTeams.find((t) => t.id === teamIdNum);
    if (team) {
      if (!season.teams.includes(teamIdNum)) {
        season.teams.push(teamIdNum);
      }
      updatedTeams.push(getTeamWithStadium(teamIdNum));
    }
  });
  availableTeams = availableTeams.map(team =>
    teamIds.includes(String(team.id)) ? { ...team, season: seasonId } : team
  );
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

// New endpoint to get rounds for a specific season
app.get("/api/seasons/:seasonId/rounds", (req, res) => {
  const { seasonId } = req.params;
  const season = seasons.find(s => s.id === seasonId);
  if (season) {
    return res.json({ rounds: season.rounds || [] });
  }
  return res.status(404).json({ message: "Season not found" });
});

// Endpoint to get a specific round of a season
app.get("/api/seasons/:seasonId/rounds/:roundId", (req, res) => {
  const { seasonId, roundId } = req.params;
  const season = seasons.find(s => s.id === seasonId);
  if (season) {
    const round = season.rounds.find(r => r.roundId === roundId);
    if (round) {
      return res.json(round);
    } else {
      return res.status(404).json({ message: "Round not found" });
    }
  }
  return res.status(404).json({ message: "Season not found" });
});

// New endpoint to add rounds to a specific season
app.post("/api/seasons/:seasonId/rounds", (req, res) => {
  const { seasonId } = req.params;
  const newRounds = req.body;
  const season = seasons.find(s => s.id === seasonId);

  if (!season) {
    return res.status(404).json({ message: "Season not found" });
  }

  if (!Array.isArray(newRounds) || newRounds.length !== 2) {
    return res.status(400).json({ message: "Must provide exactly two rounds (Lượt đi and Lượt về)." });
  }

  // Check if roundIds already exist for this season
  for (const newRound of newRounds) {
    if (season.rounds && season.rounds.some(round => round.roundId === newRound.roundId)) {
      return res.status(400).json({ message: `Round ID ${newRound.roundId} already exists for this season.` });
    }
  }

  season.rounds = [...(season.rounds || []), ...newRounds];
  res.status(201).json({ message: "Rounds added successfully", rounds: newRounds });
});

// Endpoint to update a specific round of a season
app.put("/api/seasons/:seasonId/rounds/:roundId", (req, res) => {
  const { seasonId, roundId } = req.params;
  const updatedRound = req.body;
  const season = seasons.find(s => s.id === seasonId);

  if (!season) {
    return res.status(404).json({ message: "Season not found" });
  }

  const roundIndex = season.rounds.findIndex(r => r.roundId === roundId);
  if (roundIndex === -1) {
    return res.status(404).json({ message: "Round not found" });
  }

  season.rounds[roundIndex] = { ...season.rounds[roundIndex], ...updatedRound };
  res.json(season.rounds[roundIndex]);
});

app.get("/api/seasons/cards", (req, res) => {
  const season = req.query.season;
  if (!season) {
    return res.status(404).json({ message: "Season not found" });
  }
  const cards = playerCards[season]
  res.json({ cards: cards });
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
app.get("/api/teams/available-for-season", (req, res) => {
  const availableTeamsForSeason = availableTeams.filter(team => !team.season);
  res.json({ teams: availableTeamsForSeason });
});


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
app.get("/api/teams/position", (req, res) => {
  const teamStatistics = availableTeams.map(team => {
    let participations = 0;
    let wins = 0;
    let runnerUps = 0;
    let thirdPlaces = 0;

    seasons.forEach(season => {
      const standings = calculateStandings(season.id);
      const teamStanding = standings.find(t => t.id === team.id);
      if (teamStanding) {
        participations++;
        if (teamStanding.rank === 1) {
          wins++;
        } else if (teamStanding.rank === 2) {
          runnerUps++;
        } else if (teamStanding.rank === 3) {
          thirdPlaces++;
        }
      } else {
      }
    });

    return {
      name: team.name,
      participations,
      wins,
      runnerUps,
      thirdPlaces,
    };
  });

  res.json({ teams: teamStatistics });
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

// New endpoint to get the playing history of a player
app.get("/api/players/:playerId/teams", (req, res) => {
  const { playerId } = req.params;
  const playerIdInt = parseInt(playerId);
  const playingHistory = [];

  for (const season in players) {
    for (const teamId in players[season]) {
      const teamIdInt = parseInt(teamId);
      const player = players[season][teamIdInt].find(p => p.id === playerIdInt);
      if (player) {
        playingHistory.push({
          season: season,
          teamId: teamIdInt,
          teamName: getTeamName(teamIdInt) // Use helper function to get team name
        });
      }
    }
  }

  if (playingHistory.length > 0) {
    res.json(playingHistory);
  } else {
    res.status(404).json({ message: "Player not found in any team roster." });
  }
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
      goalDifference: 0, // Added goalDifference
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
      standings[homeTeamId].goalDifference = standings[homeTeamId].goalsFor - standings[homeTeamId].goalsAgainst; // Calculate goalDifference

    }
    if (standings[awayTeamId]) {
      standings[awayTeamId].played++;
      standings[awayTeamId].goalsFor += awayScore;
      standings[awayTeamId].goalsAgainst += homeScore;
      standings[awayTeamId].goalDifference = standings[awayTeamId].goalsFor - standings[awayTeamId].goalsAgainst; // Calculate goalDifference

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
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    return b.goalsFor - a.goalsFor;
  });

  const rankedStandings = standingsArray.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));

  res.json(rankedStandings);
});

app.get("/api/matches", (req, res) => {
  const season = req.query.season;
  const team = req.query.team;
  let filteredMatches = matchesData;

  if (season) {
    filteredMatches = filteredMatches.filter(match => match.season === season);
  } else if (team) {
    filteredMatches = filteredMatches.filter(match => match.homeTeamId === parseInt(team) || match.awayTeamId === parseInt(team));
  } else {
    return res.status(400).json({ message: "Vui lòng truyền vào teamId hoặc season" });
  }

  const matchesWithDetails = filteredMatches.map(match => ({
    ...match,
    homeTeamName: getTeamName(match.homeTeamId),
    awayTeamName: getTeamName(match.awayTeamId),
    stadiumName: getStadiumName(match.stadiumId),
    roundName: getRoundName(match.season, match.round),
  }));

  res.json(matchesWithDetails);
});

app.get("/api/matches/:matchId", (req, res) => {
  const { matchId } = req.params;
  const matchIdNum = parseInt(matchId);
  const match = matchesData.find(m => m.matchId === matchIdNum);

  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  const matchWithDetails = {
    ...match,
    homeTeamName: getTeamName(match.homeTeamId),
    awayTeamName: getTeamName(match.awayTeamId),
    stadiumName: getStadiumName(match.stadiumId),
    roundName: getRoundName(match.season, match.round),
  };

  res.json(matchWithDetails);
});

app.post("/api/matches", (req, res) => {
  const newMatch = {
    matchId: matchesData.length > 0 ? Math.max(...matchesData.map(m => m.matchId)) + 1 : 1,
    season: req.body.season,
    round: req.body.round,
    homeTeamId: parseInt(req.body.homeTeamId),
    awayTeamId: parseInt(req.body.awayTeamId),
    date: req.body.date,
    time: req.body.time,
    homeScore: null,
    awayScore: null,
    stadiumId: parseInt(req.body.stadiumId),
    isFinished: false,
    goals: [],
    cards: [],
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
  } else {
    updatedMatchData.isFinished =
      updatedMatchData.homeScore !== null && updatedMatchData.awayScore !== null;
  }

  matchesData[matchIndex] = {
    ...matchesData[matchIndex],
    ...updatedMatchData,
    goals: updatedMatchData.goals // Ensure goals are updated
  };
  res.json({ message: "Match updated", match: matchesData[matchIndex] });
});
app.delete("/api/matches/:matchId", (req, res) => {
  const { matchId } = req.params;
  const matchIdNum = parseInt(matchId);

  try {
    const initialLength = matchesData.length;
    matchesData = matchesData.filter(match => match.matchId !== matchIdNum);

    if (matchesData.length < initialLength) {
      res.json({ message: "Match deleted successfully" });
    } else {
      res.status(404).json({ message: "Match not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/matches/:matchId/goals/:goalId", (req, res) => {
  const { matchId, goalId } = req.params;
  const matchIdNum = parseInt(matchId);
  const goalIdNum = parseInt(goalId);

  const match = matchesData.find((m) => m.matchId === matchIdNum);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  const goal = match.goals?.find((g) => g.goalId === goalIdNum);
  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }

  res.json(goal);
});
app.post("/api/matches/:matchId/goals", (req, res) => {
  const { matchId } = req.params;
  const matchIdNum = parseInt(matchId);
  const newGoal = {
    goalId: Date.now(),
    time: req.body.time, // Giữ lại các thông tin khác
    team: req.body.team,
    player: parseInt(req.body.playerId), // Thay playerName bằng playerId
    // ... các thông tin khác của bàn thắng
  };

  const match = matchesData.find((m) => m.matchId === matchIdNum);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  match.goals = [...(match.goals || []), newGoal];
  res.status(201).json({ message: "Goal added successfully", goal: newGoal });
});
app.put("/api/matches/:matchId/goals/:goalId", (req, res) => {

  const { matchId, goalId } = req.params;
  const matchIdNum = parseInt(matchId);
  const goalIdNum = parseInt(goalId);
  const updatedGoalData = {
    time: req.body.time,
    team: req.body.team,
    player: parseInt(req.body.player),
    type: req.body.type,
  };

  const matchIndex = matchesData.findIndex((m) => m.matchId === matchIdNum);
  if (matchIndex === -1) {
    return res.status(404).json({ message: "Match not found" });
  }

  const goalIndex = matchesData[matchIndex].goals.findIndex(
    (g) => g.goalId === goalIdNum
  );
  if (goalIndex === -1) {
    return res.status(404).json({ message: "Goal not found" });
  }

  matchesData[matchIndex].goals[goalIndex] = {
    ...matchesData[matchIndex].goals[goalIndex],
    ...updatedGoalData,
  };
  res.json({ message: "Goal updated successfully", goal: matchesData[matchIndex].goals[goalIndex] });
});
app.delete("/api/matches/:matchId/goals/:goalId", (req, res) => {
  const { matchId, goalId } = req.params;
  const matchIdNum = parseInt(matchId);
  const goalIdNum = parseInt(goalId);

  const matchIndex = matchesData.findIndex((m) => m.matchId === matchIdNum);
  if (matchIndex === -1) {
    return res.status(404).json({ message: "Match not found" });
  }

  const initialLength = matchesData[matchIndex].goals.length;
  matchesData[matchIndex].goals = matchesData[matchIndex].goals.filter(
    (g) => g.goalId !== goalIdNum
  );

  if (matchesData[matchIndex].goals.length < initialLength) {
    res.json({ message: "Goal deleted successfully" });
  } else {
    res.status(404).json({ message: "Goal not found" });
  }
});

app.get("/api/matches/:matchId/cards/:cardId", (req, res) => {
  const { matchId, cardId } = req.params;
  const matchIdNum = parseInt(matchId);
  const cardIdNum = parseInt(cardId);

  const match = matchesData.find((m) => m.matchId === matchIdNum);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  const card = match.cards?.find((c) => c.cardId === cardIdNum);
  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  res.json(card);
});

// POST a new card to a match
app.post("/api/matches/:matchId/cards", (req, res) => {
  const { matchId } = req.params;
  const matchIdNum = parseInt(matchId);
  const newCard = {
    cardId: Date.now(),
    time: req.body.time,
    type: req.body.type,
    teamId: parseInt(req.body.teamId),
    playerId: parseInt(req.body.player),
  };

  const match = matchesData.find((m) => m.matchId === matchIdNum);
  if (!match) {
    return res.status(404).json({ message: "Match not found" });
  }

  match.cards = [...(match.cards || []), newCard];
  res.status(201).json({ message: "Card added successfully", card: newCard });
});

// PUT (update) an existing card of a match
app.put("/api/matches/:matchId/cards/:cardId", (req, res) => {
  const { matchId, cardId } = req.params;
  const matchIdNum = parseInt(matchId);
  const cardIdNum = parseInt(cardId);
  const updatedCardData = {
    time: req.body.time,
    type: req.body.type,
    teamId: parseInt(req.body.teamId),
    playerId: parseInt(req.body.player),
  };

  const matchIndex = matchesData.findIndex((m) => m.matchId === matchIdNum);
  if (matchIndex === -1) {
    return res.status(404).json({ message: "Match not found" });
  }

  const cardIndex = matchesData[matchIndex].cards.findIndex(
    (c) => c.cardId === cardIdNum
  );
  if (cardIndex === -1) {
    return res.status(404).json({ message: "Card not found" });
  }

  matchesData[matchIndex].cards[cardIndex] = {
    ...matchesData[matchIndex].cards[cardIndex],
    ...updatedCardData,
  };

  res.json({ message: "Card updated successfully", card: matchesData[matchIndex].cards[cardIndex] });
});

// DELETE a specific card of a match
app.delete("/api/matches/:matchId/cards/:cardId", (req, res) => {
  const { matchId, cardId } = req.params;
  const matchIdNum = parseInt(matchId);
  const cardIdNum = parseInt(cardId);

  const matchIndex = matchesData.findIndex((m) => m.matchId === matchIdNum);
  if (matchIndex === -1) {
    return res.status(404).json({ message: "Match not found" });
  }

  const initialLength = matchesData[matchIndex].cards.length;
  matchesData[matchIndex].cards = matchesData[matchIndex].cards.filter(
    (c) => c.cardId !== cardIdNum
  );

  if (matchesData[matchIndex].cards.length < initialLength) {
    res.json({ message: "Card deleted successfully" });
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  settingsData = newSettings; // Update the settings data
  res.status(200).json({ message: 'Settings saved successfully' });
});

app.get('/api/settings', (req, res) => {
  res.status(200).json(settingsData); // Send the current settings data
});
// Endpoint to get types settings
app.get('/api/types-settings', (req, res) => {
  res.json(typeSettings);
});

// Endpoint to save types settings
app.post('/api/types-settings', (req, res) => {
  typeSettings = req.body;
  res.json({ message: 'Types settings saved successfully' });
})

function calculateStandings(seasonId) {
  const seasonData = seasons.find(s => s.id === seasonId);
  if (!seasonData) {
    return [];
  }

  const teamsInSeason = seasonData.teams
    ? seasonData.teams.map((id) =>
      availableTeams.find((team) => team.id === id)
    )
    : [];


  if (!teamsInSeason || teamsInSeason.length === 0) {
    return [];
  }

  const standings = teamsInSeason.reduce((acc, team) => {
    if (team) {
      acc[team.id] = {
        id: team.id,
        name: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        season: seasonId,
      };
    } else {
    }
    return acc;
  }, {});

  const matchesForSeason = matchesData.filter((match) => match.season === seasonId);

  matchesForSeason.forEach((match) => {
    const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

    matchesForSeason.forEach((match) => { // **POTENTIAL ISSUE: Looping through matches twice!**
      const { homeTeamId, awayTeamId, homeScore, awayScore } = match;

      if (standings[homeTeamId]) {
        standings[homeTeamId].played++;
        standings[homeTeamId].goalsFor += homeScore || 0;
        standings[homeTeamId].goalsAgainst += awayScore || 0;
        standings[homeTeamId].goalDifference = standings[homeTeamId].goalsFor - standings[homeTeamId].goalsAgainst;
      }
      if (standings[awayTeamId]) {
        standings[awayTeamId].played++;
        standings[awayTeamId].goalsFor += awayScore || 0;
        standings[awayTeamId].goalsAgainst += homeScore || 0;
        standings[awayTeamId].goalDifference = standings[awayTeamId].goalsFor - standings[awayTeamId].goalsAgainst;
      }

      if (homeScore > awayScore) {
        if (standings[homeTeamId]) standings[homeTeamId].won++;
        if (standings[homeTeamId]) standings[homeTeamId].points += 3;
        if (standings[awayTeamId]) standings[awayTeamId].lost++;
      } else if (awayScore > homeScore) {
        if (standings[awayTeamId]) standings[awayTeamId].won++;
        if (standings[awayTeamId]) standings[awayTeamId].points += 3;
        if (standings[homeTeamId]) standings[homeTeamId].lost++;
      } else if (homeScore === awayScore) {
        if (standings[homeTeamId]) standings[homeTeamId].drawn++;
        if (standings[homeTeamId]) standings[homeTeamId].points += 1;
        if (standings[awayTeamId]) standings[awayTeamId].drawn++;
        if (standings[awayTeamId]) standings[awayTeamId].points += 1;
      }
    });
  });

  const sortedStandings = Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    return b.goalsFor - a.goalsFor;
  }).map((team, index) => ({ ...team, rank: index + 1 }));

  return sortedStandings;
}

app.get("/api/teams/:teamId/position", (req, res) => { 
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({ message: "Thiếu teamId" });
  }

  const teamIdNum = parseInt(teamId);
  const teamHistory = [];

  seasons.forEach(season => {
    const standings = calculateStandings(season.id);
    const teamStanding = standings.find(t => t.id === teamIdNum);
    if (teamStanding) {
      teamHistory.push({
        season: season.id,
        position: teamStanding.rank,
        win: teamStanding.won,
        loss: teamStanding.lost,
        draw: teamStanding.drawn,
        difference: teamStanding.goalDifference,
        point: teamStanding.points,
      });
    } else {
    }
  });

  res.json({ teams: teamHistory });
});
// Start Server
app.listen(PORT, () => {
});

  