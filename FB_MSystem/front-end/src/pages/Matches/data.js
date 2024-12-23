export const allMatches = [
    {
      id: 1,
      homeTeam: "Team A",
      awayTeam: "Team B",
      date: "2024-01-15",
      time: "18:00",
      season: "2023-2024",
      round: "1",
      stadium: "Sân Mỹ Đình",
      isFinished: true, 
      homeScore: 2,    
      awayScore: 1,   
      goals: [      
        {
          player: "Cầu thủ A1",
          team: "Team A",
          type: "Pen",
          time: "15'"
        },
        {
          player: "Cầu thủ A2",
          team: "Team A",
          type: "Đánh đầu",
          time: "45'"
        },
        {
          player: "Cầu thủ B1",
          team: "Team B",
          type: "Sút xa",
          time: "60'"
        },
      ],
      cards: [
        {
          player: "Cầu thủ A3",
          team: "Team A",
          type: "Yellow", // "Yellow" hoặc "Red"
          time: "30'",
        },
        {
          player: "Cầu thủ B2",
          team: "Team B",
          type: "Red",
          time: "75'",
        },
      ],
    },
    {
      id: 2,
      homeTeam: "Team C",
      awayTeam: "Team A",
      date: "2024-01-17",
      time: "20:00",
      season: "2023-2024",
      round: "1",
      stadium: "Sân Hàng Đẫy",
      isFinished: false,
    },
    {
      id: 3,
      homeTeam: "Team B",
      awayTeam: "Team C",
      date: "2024-01-20",
      time: "19:00",
      season: "2022-2023",
      round: "2",
      stadium: "Sân Thống Nhất",
      isFinished: true,
      homeScore: 0,
      awayScore: 0,
      goals: []
    },
    // Add more matches here
  ];