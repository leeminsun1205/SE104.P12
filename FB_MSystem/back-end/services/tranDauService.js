const { VongDau, TranDau, DoiBong, SanThiDau, MgDbCt } = require('../models');
const _ = require('lodash'); // Thư viện lodash để hỗ trợ ngẫu nhiên hóa

async function taoTranDau(maMuaGiai) {
    try {
        // Lấy danh sách đội bóng trong mùa giải
        const doiBongTrongMua = await MgDbCt.findAll({
            where: { MaMuaGiai: maMuaGiai },
            attributes: ['MaDoiBong'],
            group: ['MaDoiBong'], // Loại bỏ trùng lặp
        });

        let doiBongList = doiBongTrongMua.map(item => item.MaDoiBong);

        // Nếu số đội là lẻ, thêm một đội giả "BYE" để xử lý
        const soDoi = doiBongList.length;
        if (soDoi < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo trận đấu.');
        }

        if (soDoi % 2 !== 0) {
            doiBongList.push(null); // null đại diện cho đội nghỉ (BYE)
        }

        // Ngẫu nhiên hóa danh sách đội bóng
        doiBongList = _.shuffle(doiBongList);

        const soTranMoiVong = Math.floor(doiBongList.length / 2);

        // Lấy danh sách vòng đấu
        const vongDauList = await VongDau.findAll({
            where: { MaMuaGiai: maMuaGiai },
            order: [['SoThuTu', 'ASC']],
        });

        if (vongDauList.length < (soDoi - 1) * 2) {
            throw new Error('Số vòng đấu không đủ để tạo lịch thi đấu.');
        }

        // Tạo lịch thi đấu
        const tranDauData = [];
        const doiBongSanhach = {}; // Theo dõi số trận sân nhà/sân khách

        // Khởi tạo bộ đếm cho từng đội
        doiBongList.forEach(doi => {
            if (doi) {
                doiBongSanhach[doi] = { sanNha: 0, sanKhach: 0 };
            }
        });

        const ngayBatDau = new Date(vongDauList[0].NgayBatDau || Date.now());
        let ngayHienTai = new Date(ngayBatDau);

        for (let luot = 0; luot < 2; luot++) {
            let doiBongThamGia = [...doiBongList];
            for (let vongIndex = 0; vongIndex < doiBongList.length - 1; vongIndex++) {
                const vongDau = vongDauList[luot * (doiBongList.length - 1) + vongIndex];

                for (let i = 0; i < soTranMoiVong; i++) {
                    const doiNha = doiBongThamGia[i];
                    const doiKhach = doiBongThamGia[doiBongThamGia.length - 1 - i];

                    // Nếu gặp đội nghỉ (BYE), bỏ qua trận này
                    if (!doiNha || !doiKhach) continue;

                    // Hoán đổi đội nhà/khách để cân bằng số trận
                    if (doiBongSanhach[doiNha].sanNha > doiBongSanhach[doiKhach].sanNha) {
                        [doiNha, doiKhach] = [doiKhach, doiNha];
                    }

                    const maTranDau = `${vongDau.MaVongDau}_TD${i + 1}`;
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
                        GioThiDau: '18:00:00',
                    });

                    // Cập nhật bộ đếm
                    doiBongSanhach[doiNha].sanNha++;
                    doiBongSanhach[doiKhach].sanKhach++;
                }

                // Xoay vòng đội bóng (với đội nghỉ cố định ở cuối)
                const last = doiBongThamGia.pop();
                doiBongThamGia.splice(1, 0, last);

                // Cập nhật ngày thi đấu
                ngayHienTai.setDate(ngayHienTai.getDate() + 7);
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
