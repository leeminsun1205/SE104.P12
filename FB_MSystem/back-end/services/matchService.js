const { VongDau, TranDau, DoiBong, SanThiDau, MgDbCt } = require('../models');

async function taoTranDau(maMuaGiai) {
    try {
        // Lấy danh sách đội bóng trong mùa giải
        const doiBongTrongMua = await MgDbCt.findAll({
            where: { MaMuaGiai: maMuaGiai },
            attributes: ['MaDoiBong'],
            group: ['MaDoiBong'], // Loại bỏ trùng lặp
        });

        const doiBongList = doiBongTrongMua.map(item => item.MaDoiBong);

        if (doiBongList.length < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo trận đấu.');
        }

        const soDoi = doiBongList.length;
        const soTranMoiVong = Math.floor(soDoi / 2);

        // Lấy danh sách vòng đấu
        const vongDauList = await VongDau.findAll({
            where: { MaMuaGiai: maMuaGiai },
            order: [['SoThuTu', 'ASC']],
        });

        if (vongDauList.length < (soDoi - 1) * 2) {
            throw new Error('Số vòng đấu không đủ để tạo lịch thi đấu.');
        }

        // Tạo lịch thi đấu (Lượt đi và lượt về)
        const tranDauData = [];
        const ngayBatDau = new Date(vongDauList[0].NgayBatDau || Date.now()); // Lấy ngày bắt đầu vòng đầu tiên
        let ngayHienTai = new Date(ngayBatDau);

        // Phát sinh lịch thi đấu theo vòng tròn
        for (let luot = 0; luot < 2; luot++) { // 0 = lượt đi, 1 = lượt về
            const doiBongThamGia = [...doiBongList];
            for (let vongIndex = 0; vongIndex < soDoi - 1; vongIndex++) {
                const vongDau = vongDauList[luot * (soDoi - 1) + vongIndex];

                for (let i = 0; i < soTranMoiVong; i++) {
                    const doiNha = doiBongThamGia[i];
                    const doiKhach = doiBongThamGia[soDoi - 1 - i];
                    const maTranDau = `${vongDau.MaVongDau}_TD${i + 1}`;

                    // Sân thi đấu: Lượt đi thì sân nhà của đội nhà, lượt về thì sân nhà của đội khách
                    const maSan = luot === 0
                        ? (await DoiBong.findByPk(doiNha)).MaSan
                        : (await DoiBong.findByPk(doiKhach)).MaSan;

                    tranDauData.push({
                        MaVongDau: vongDau.MaVongDau,
                        MaTranDau: maTranDau,
                        MaDoiBongNha: doiNha,
                        MaDoiBongKhach: doiKhach,
                        MaSan: maSan,
                        NgayThiDau: ngayHienTai.toISOString().split('T')[0],
                        GioThiDau: '18:00:00', // Giờ mặc định
                    });
                }

                // Xoay vòng đội bóng (đảo lịch)
                const last = doiBongThamGia.pop();
                doiBongThamGia.splice(1, 0, last);

                // Cập nhật ngày thi đấu
                ngayHienTai.setDate(ngayHienTai.getDate() + 7); // Cách mỗi vòng 7 ngày
            }
        }

        // Lưu vào cơ sở dữ liệu
        await TranDau.bulkCreate(tranDauData, { ignoreDuplicates: true });

        console.log(`Đã tạo ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`);
        return tranDauData;
    } catch (error) {
        console.error('Lỗi khi tạo trận đấu:', error.message);
        throw error;
    }
}

module.exports = { taoTranDau };
