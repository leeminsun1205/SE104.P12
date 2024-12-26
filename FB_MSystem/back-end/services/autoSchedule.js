const { VongDau, TranDau, DoiBong, SanThiDau, MgDbCt } = require('../models');
const _ = require('lodash'); // Thư viện lodash để hỗ trợ ngẫu nhiên hóa

async function autoSchedule(maMuaGiai) {
    try {
        // Lấy danh sách đội bóng thuộc mùa giải
        const doiBongTrongMua = await MgDbCt.findAll({
            where: { MaMuaGiai: maMuaGiai },
            attributes: ['MaDoiBong'],
            group: ['MaDoiBong'],
            include: [
                {
                    model: DoiBong,
                    as: 'DoiBong',
                },
            ],
        });

        let doiBongList = doiBongTrongMua.map(item => item.MaDoiBong);

        const soDoi = doiBongList.length;
        console.log('Đội bóng trong mùa giải:', doiBongTrongMua);
        console.log('Số đội bóng tính được:', soDoi);
        if (soDoi < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo vòng đấu.');
        }

        // Xử lý trường hợp số đội lẻ
        if (soDoi % 2 !== 0) {
            doiBongList.push(null); // Thêm đội "BYE" để xử lý số đội lẻ
        }

        // Số vòng đấu = số đội x 2 nếu số đội lẻ, hoặc (số đội - 1) x 2 nếu số đội chẵn
        const soVongDau = (soDoi % 2 === 0) ? (soDoi - 1) * 2 : soDoi * 2;

        // Tạo các vòng đấu
        const vongDauData = [];
        for (let i = 0; i < soVongDau; i++) {
            const luotDau = i < soVongDau / 2 ? 0 : 1; // 0 = Lượt đi, 1 = Lượt về
            const soThuTu = i + 1;
            const maVongDau = `${maMuaGiai}_VD${soThuTu.toString().padStart(2, '0')}`;

            const ngayBatDau = null; // Để người dùng tự điền
            const ngayKetThuc = null; // Để người dùng tự điền

            vongDauData.push({
                MaVongDau: maVongDau,
                MaMuaGiai: maMuaGiai,
                LuotDau: luotDau,
                NgayBatDau: ngayBatDau,
                NgayKetThuc: ngayKetThuc,
            });
        }

        // Lưu vòng đấu vào cơ sở dữ liệu
        await VongDau.bulkCreate(vongDauData, { ignoreDuplicates: true });
        console.log(`Đã tạo ${soVongDau} vòng đấu cho mùa giải ${maMuaGiai}.`);

        // Tạo lịch thi đấu ngay sau khi tạo vòng đấu
        const tranDauData = [];

        const tranDauSanNhaKhach = {}; // Theo dõi số trận sân nhà/khách liên tiếp của mỗi đội

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

                    // Nếu gặp đội nghỉ (BYE), bỏ qua trận này
                    if (!doiNha || !doiKhach) continue;

                    // Kiểm tra và hoán đổi để không quá 2 trận sân nhà hoặc sân khách liên tiếp
                    if (tranDauSanNhaKhach[doiNha].sanNha >= 2) {
                        [doiNha, doiKhach] = [doiKhach, doiNha];
                    } else if (tranDauSanNhaKhach[doiKhach].sanKhach >= 2) {
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
                        NgayThiDau: null, // Để người dùng tự điền
                        GioThiDau: null, // Để người dùng tự điền
                    });

                    // Cập nhật bộ đếm sân nhà/sân khách liên tiếp
                    tranDauSanNhaKhach[doiNha].sanNha++;
                    tranDauSanNhaKhach[doiNha].sanKhach = 0;

                    tranDauSanNhaKhach[doiKhach].sanKhach++;
                    tranDauSanNhaKhach[doiKhach].sanNha = 0;
                }

                // Xoay vòng đội bóng (với đội nghỉ cố định ở cuối)
                const last = doiBongThamGia.pop();
                doiBongThamGia.splice(1, 0, last);
            }
        }

        // Lưu trận đấu vào cơ sở dữ liệu
        await TranDau.bulkCreate(tranDauData, { ignoreDuplicates: true });
        console.log(`Đã tạo ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`);

        return { vongDauData, tranDauData }; // Trả về cả vòng đấu và trận đấu đã tạo
    } catch (error) {
        console.error('Lỗi khi tạo vòng đấu và trận đấu:', error.message);
        throw error; // Ném lỗi để controller xử lý
    }
}

module.exports = { autoSchedule };
