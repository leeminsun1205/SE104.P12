// --- START OF FILE data.js ---
const availableTeams = [
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
];

const seasons = [
    {
      id: "2023-2024",
      name: "Mùa giải 2023-2024",
      startDate: "2023-08-01",
      endDate: "2024-05-30",
      teams: [1, 2],
      rounds: [
        {
          roundId: "2023-2024-ROUND1",
          name: "Lượt đi",
          startDate: "2023-08-05",
          endDate: "2023-08-07",
        },
      ],
    },
];

const players = {
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
    },
};

// Khai báo availablePlayers - Danh sách cầu thủ có sẵn
const availablePlayers = [
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
];
const stadiums = [
    {
      stadiumId: 1,
      stadiumName: "Hàng Đẫy",
      address: "Trịnh Hoài Đức, Cát Linh, Đống Đa, Hà Nội",
      capacity: 22500,
      standard: 5,
    },
];

// New data structure for matches
const matchesData = [
    {
      matchId: 1,
      season: "2023-2024",
      round: "2023-2024-ROUND1",
      homeTeamId: 1, // Reference to Hà Nội FC
      awayTeamId: 2, // Reference to Viettel FC
      date: "2023-08-05",
      time: "19:15",
      homeScore: 2,
      awayScore: 1,
      stadiumId: 1,
      isFinished: true,
      goals: [
        { player: "Văn Quyết", team: "Hà Nội FC", type: "penalty", time: "30'" },
      ],
      cards: [
        { player: "Hùng Dũng", team: "Hà Nội FC", type: "Yellow", time: "60'" },
      ],
    },
];
let typeSettings = {
    goalTypes: [
      { code: 'BT001', name: 'Bàn thắng thường', description: 'Bàn thắng được ghi trong tình huống thông thường.' },
      { code: 'BT002', name: 'Phản lưới nhà', description: 'Bàn thắng do cầu thủ tự đưa bóng vào lưới nhà.' },
      { code: 'BT003', name: 'Penalty', description: 'Bàn thắng từ chấm phạt đền.' },
    ],
    cardTypes: [
      { code: 'TP001', name: 'Vàng', description: 'Cảnh cáo cho hành vi phi thể thao.' },
      { code: 'TP002', name: 'Đỏ', description: 'Truất quyền thi đấu do lỗi nghiêm trọng.' },
    ],
    priorityOptions: [
      { code: 'UT1', name: 'Điểm số' },
      { code: 'UT2', name: 'Hiệu số' },
      { code: 'UT3', name: 'Số bàn thắng' },
    ],
    rankingPriorityOrder: ['UT1', 'UT2', 'UT3'],
  };
  
module.exports = {
    availableTeams,
    seasons,
    players,
    availablePlayers,
    stadiums,
    matchesData,
    typeSettings
};