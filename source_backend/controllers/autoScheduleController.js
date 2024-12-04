const DoiBong = require('../models/doibong');
const VongDau = require('../models/vongdau');
const TranDau = require('../models/trandau');

const autoSchedule = async (req, res) => {
    try {
        const { MaMuaGiai, startDate, intervalDays } = req.body;

        // Lấy danh sách đội bóng của mùa giải
        const doiBongs = await DoiBong.findAll({ where: { MaMuaGiai } });

        if (doiBongs.length < 2) {
            return res.status(400).json({ message: 'Không đủ số đội để xếp lịch thi đấu!' });
        }

        const doiBongIds = doiBongs.map((db) => db.MaDoiBong);
        const numTeams = doiBongIds.length;

        // Kiểm tra nếu số đội lẻ thì thêm đội "ảo"
        if (numTeams % 2 !== 0) {
            doiBongIds.push(null); // Đội "ảo"
        }

        const rounds = doiBongIds.length - 1; // Số vòng đấu
        const matchesPerRound = doiBongIds.length / 2; // Số trận mỗi vòng
        const schedule = []; // Lưu lịch thi đấu

        // Lượt đi
        let currentDate = new Date(startDate);
        for (let round = 0; round < rounds; round++) {
            const roundMatches = [];
            for (let match = 0; match < matchesPerRound; match++) {
                const home = doiBongIds[match];
                const away = doiBongIds[doiBongIds.length - 1 - match];
                if (home && away) {
                    roundMatches.push({ home, away });
                }
            }

            // Xoay vòng đội bóng
            doiBongIds.splice(1, 0, doiBongIds.pop());
            schedule.push(roundMatches);

            // Tạo vòng đấu lượt đi
            const MaVongDau = `VD${MaMuaGiai}D${round + 1}`;
            await VongDau.create({
                MaVongDau,
                MaMuaGiai,
                LuotDau: 1,
                SoThuTu: round + 1,
                NgayBatDau: currentDate.toISOString().split('T')[0],
                NgayKetThuc: currentDate.toISOString().split('T')[0],
            });

            // Lưu trận đấu lượt đi
            for (const match of roundMatches) {
                await TranDau.create({
                    MaTranDau: `TD${MaVongDau}${match.home}${match.away}`,
                    MaVongDau,
                    MaDoiBongNha: match.home,
                    MaDoiBongKhach: match.away,
                    NgayThiDau: currentDate.toISOString().split('T')[0],
                    GioThiDau: '18:00:00',
                    MaSan: null,
                    BanThangDoiNha: 0,
                    BanThangDoiKhach: 0,
                });
            }

            // Cập nhật ngày thi đấu
            currentDate.setDate(currentDate.getDate() + intervalDays);
        }

        // Lượt về
        for (let round = 0; round < rounds; round++) {
            const roundMatches = schedule[round].map((match) => ({
                home: match.away,
                away: match.home,
            }));

            // Tạo vòng đấu lượt về
            const MaVongDau = `VD${MaMuaGiai}R${round + 1}`;
            await VongDau.create({
                MaVongDau,
                MaMuaGiai,
                LuotDau: 0,
                SoThuTu: round + 1,
                NgayBatDau: currentDate.toISOString().split('T')[0],
                NgayKetThuc: currentDate.toISOString().split('T')[0],
            });

            // Lưu trận đấu lượt về
            for (const match of roundMatches) {
                await TranDau.create({
                    MaTranDau: `TD${MaVongDau}${match.home}${match.away}`,
                    MaVongDau,
                    MaDoiBongNha: match.home,
                    MaDoiBongKhach: match.away,
                    NgayThiDau: currentDate.toISOString().split('T')[0],
                    GioThiDau: '18:00:00',
                    MaSan: null,
                    BanThangDoiNha: 0,
                    BanThangDoiKhach: 0,
                });
            }

            // Cập nhật ngày thi đấu
            currentDate.setDate(currentDate.getDate() + intervalDays);
        }

        res.status(201).json({ message: 'Lịch thi đấu được xếp thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xếp lịch thi đấu!', details: error.message });
    }
};

module.exports = { autoSchedule };
