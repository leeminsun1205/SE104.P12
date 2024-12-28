const { VongDau, TranDau, DoiBong, MuaGiai, MgDb } = require('../models');
const _ = require('lodash'); // Thư viện lodash để hỗ trợ ngẫu nhiên hóa

async function autoSchedule(maMuaGiai) {
    try {
        const muaGiai = await MuaGiai.findByPk(maMuaGiai);
        if (!muaGiai) {
            throw new Error('Không tìm thấy thông tin mùa giải.');
        }

        const { NgayBatDau: NgayBatDauMua, NgayKetThuc: NgayKetThucMua } = muaGiai;

        if (!NgayBatDauMua || !NgayKetThucMua) {
            throw new Error('Ngày bắt đầu và kết thúc của mùa giải chưa được cấu hình.');
        }

        const startMua = new Date(NgayBatDauMua);
        const endMua = new Date(NgayKetThucMua);
        const totalDays = (endMua - startMua) / (1000 * 60 * 60 * 24);

        // Lấy danh sách đội bóng thuộc mùa giải
        const doiBongTrongMua = await MgDb.findAll({
            where: { MaMuaGiai: maMuaGiai },
            attributes: ['MaDoiBong'],
        });

        const doiBongList = doiBongTrongMua.map(item => item.MaDoiBong);
        const soDoi = doiBongList.length;

        if (soDoi < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo vòng đấu.');
        }

        // Xử lý số đội lẻ
        const numTeams = soDoi % 2 === 0 ? soDoi : soDoi + 1;
        const roundsPerSeason = (numTeams - 1) * 2; // Số vòng đấu (lượt đi và về)
        const avgDaysPerRound = Math.floor(totalDays / roundsPerSeason);
        const minDaysPerRound = Math.max(1, Math.floor(avgDaysPerRound * 0.7)); // Giảm biên độ dưới
        const maxDaysPerRound = Math.floor(avgDaysPerRound * 1.1); // Giảm biên độ trên

        const vongDauData = [];
        let currentStartDate = new Date(startMua);

        for (let i = 0; i < roundsPerSeason; i++) {
            const luotDau = i < roundsPerSeason / 2 ? 0 : 1; // 0: Lượt đi, 1: Lượt về
            const soThuTu = i + 1;
            const maVongDau = `${maMuaGiai}_VD${soThuTu.toString().padStart(2, '0')}`;

            let roundDays = Math.floor(minDaysPerRound + Math.random() * (maxDaysPerRound - minDaysPerRound + 1));
            let ngayKetThuc = new Date(currentStartDate);
            ngayKetThuc.setDate(currentStartDate.getDate() + roundDays);

            // Đảm bảo ngày kết thúc vòng không vượt quá ngày kết thúc mùa giải
            if (ngayKetThuc > endMua) {
                ngayKetThuc = new Date(endMua);
            }

            vongDauData.push({
                MaVongDau: maVongDau,
                MaMuaGiai: maMuaGiai,
                LuotDau: luotDau,
                NgayBatDau: new Date(currentStartDate),
                NgayKetThuc: new Date(ngayKetThuc),
            });

            // Cập nhật ngày bắt đầu cho vòng tiếp theo, đảm bảo không vượt quá ngày kết thúc mùa giải
            currentStartDate = new Date(ngayKetThuc);
            currentStartDate.setDate(currentStartDate.getDate() + 1);
            if (currentStartDate > endMua) {
                break; // Nếu đã vượt quá ngày kết thúc mùa giải, dừng lại
            }
        }

        await VongDau.bulkCreate(vongDauData, { ignoreDuplicates: true });

        // Tạo lịch thi đấu
        const tranDauData = [];
        const numTeamsForScheduling = soDoi % 2 === 0 ? soDoi : soDoi + 1;
        const teams = [...doiBongList];
        if (soDoi % 2 !== 0) {
            teams.push(null); // Add a "null" team for odd number of teams
        }

        for (let roundIndex = 0; roundIndex < vongDauData.length; roundIndex++) { // Duyệt qua số vòng đấu đã tạo
            const vongDau = vongDauData[roundIndex];
            const teamsInRound = [...teams];

            for (let matchDay = 0; matchDay < numTeamsForScheduling / 2; matchDay++) {
                const teamCount = teamsInRound.length;
                const team1 = teamsInRound[matchDay];
                const team2 = teamsInRound[teamCount - 1 - matchDay];

                if (team1 && team2) {
                    const maTranDau = `${vongDau.MaVongDau}_TD${matchDay + 1}`;
                    const [doiNha, doiKhach] = roundIndex < roundsPerSeason / 2 ? [team1, team2] : [team2, team1];
                    const maSan = (await DoiBong.findByPk(doiNha)).MaSan;
                    const startRoundDate = new Date(vongDau.NgayBatDau);
                    const endRoundDate = new Date(vongDau.NgayKetThuc);
                    // Đảm bảo ngày thi đấu không vượt quá ngày kết thúc vòng
                    const latestPossibleDate = new Date(endRoundDate);
                    latestPossibleDate.setDate(latestPossibleDate.getDate()); // Để chắc chắn không bị lệch 1 ngày

                    const minTime = startRoundDate.getTime();
                    const maxTime = latestPossibleDate.getTime();

                    const randomTime = minTime + Math.random() * (maxTime - minTime);
                    const ngayThiDau = new Date(randomTime);

                    tranDauData.push({
                        MaVongDau: vongDau.MaVongDau,
                        MaTranDau: maTranDau,
                        MaDoiBongNha: doiNha,
                        MaDoiBongKhach: doiKhach,
                        MaSan: maSan,
                        NgayThiDau: ngayThiDau,
                        GioThiDau: null,
                    });
                }
            }

            // Thuật toán Robin-round để xoay lịch thi đấu
            const fixedTeam = teamsInRound[0];
            const rotatingTeams = teamsInRound.slice(1);
            const lastTeam = rotatingTeams.pop();
            rotatingTeams.unshift(lastTeam);
            teamsInRound.splice(1, teamsInRound.length - 1, ...rotatingTeams);
        }

        await TranDau.bulkCreate(tranDauData, { ignoreDuplicates: true });

        return { vongDauData, tranDauData };
    } catch (error) {
        console.error('Lỗi khi tạo vòng đấu và trận đấu:', error.message);
        throw error;
    }
}

module.exports = { autoSchedule };