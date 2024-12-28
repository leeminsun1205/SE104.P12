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
        if (soDoi % 2 !== 0) {
            doiBongList.push(null); // Thêm đội "BYE"
        }

        const soVongDau = (soDoi % 2 === 0) ? (soDoi - 1) * 2 : soDoi * 2;
        const ngayChoMoiVong = Math.floor((new Date(NgayKetThucMua) - new Date(NgayBatDauMua)) / (soVongDau * 86400000));

        const vongDauData = [];
        const randomDateInRange = (startDate, endDate) => {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            return new Date(start + Math.random() * (end - start));
        };
        for (let i = 0; i < soVongDau; i++) {
            const luotDau = i < soVongDau / 2 ? 0 : 1; // 0: Lượt đi, 1: Lượt về
            const soThuTu = i + 1;
            const maVongDau = `${maMuaGiai}_VD${soThuTu.toString().padStart(2, '0')}`;

            const ngayBatDau = randomDateInRange(NgayBatDauMua, NgayKetThucMua);
            const ngayKetThuc = randomDateInRange(ngayBatDau, NgayKetThucMua);

            vongDauData.push({
                MaVongDau: maVongDau,
                MaMuaGiai: maMuaGiai,
                LuotDau: luotDau,
                NgayBatDau: ngayBatDau,
                NgayKetThuc: ngayKetThuc,
            });
        }

        await VongDau.bulkCreate(vongDauData, { ignoreDuplicates: true });
        console.log(`Đã tạo ${soVongDau} vòng đấu cho mùa giải ${maMuaGiai}.`);

        // Tạo lịch thi đấu
        const tranDauData = [];
        const tranDauSanNhaKhach = {};

        doiBongList.forEach(doi => {
            if (doi) tranDauSanNhaKhach[doi] = { sanNha: 0, sanKhach: 0 };
        });

        for (let luot = 0; luot < 2; luot++) {
            let doiBongThamGia = [...doiBongList];
            for (let vongIndex = 0; vongIndex < doiBongList.length - 1; vongIndex++) {
                const vongDau = vongDauData[luot * (doiBongList.length - 1) + vongIndex];

                for (let i = 0; i < Math.floor(doiBongList.length / 2); i++) {
                    let doiNha = doiBongThamGia[i];
                    let doiKhach = doiBongThamGia[doiBongThamGia.length - 1 - i];

                    if (!doiNha || !doiKhach) continue;

                    if (tranDauSanNhaKhach[doiNha].sanNha >= 2) {
                        [doiNha, doiKhach] = [doiKhach, doiNha];
                    } else if (tranDauSanNhaKhach[doiKhach].sanKhach >= 2) {
                        [doiNha, doiKhach] = [doiKhach, doiNha];
                    }

                    const maTranDau = `${vongDau.MaVongDau}_TD${i + 1}`;
                    const maSan = luot === 0
                        ? (await DoiBong.findByPk(doiNha)).MaSan
                        : (await DoiBong.findByPk(doiKhach)).MaSan;

                    const ngayThiDau = randomDateInRange(vongDau.NgayBatDau, vongDau.NgayKetThuc);

                    if (ngayThiDau > new Date(vongDau.NgayKetThuc)) {
                        throw new Error(`Ngày thi đấu vượt quá giới hạn vòng đấu: ${vongDau.MaVongDau}`);
                    }

                    tranDauData.push({
                        MaVongDau: vongDau.MaVongDau,
                        MaTranDau: maTranDau,
                        MaDoiBongNha: doiNha,
                        MaDoiBongKhach: doiKhach,
                        MaSan: maSan,
                        NgayThiDau: ngayThiDau,
                        GioThiDau: null,
                    });

                    tranDauSanNhaKhach[doiNha].sanNha++;
                    tranDauSanNhaKhach[doiNha].sanKhach = 0;

                    tranDauSanNhaKhach[doiKhach].sanKhach++;
                    tranDauSanNhaKhach[doiKhach].sanNha = 0;
                }

                const last = doiBongThamGia.pop();
                doiBongThamGia.splice(1, 0, last);
            }
        }

        await TranDau.bulkCreate(tranDauData, { ignoreDuplicates: true });
        console.log(`Đã tạo ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`);

        return { vongDauData, tranDauData };
    } catch (error) {
        console.error('Lỗi khi tạo vòng đấu và trận đấu:', error.message);
        throw error;
    }
}

module.exports = { autoSchedule };
