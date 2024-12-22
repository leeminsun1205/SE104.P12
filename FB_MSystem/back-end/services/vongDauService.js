const { VongDau, DoiBong, MG_DB_CT } = require('../models');

async function taoVongDau(maMuaGiai) {
    try {
        // Lấy danh sách đội bóng thuộc mùa giải
        const doiBongTrongMua = await MG_DB_CT.findAll({
            where: { MaMuaGiai: maMuaGiai },
            include: [
                {
                    model: DoiBong,
                    as: 'DoiBong',
                },
            ],
        });

        const soDoi = doiBongTrongMua.length;

        if (soDoi < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo vòng đấu.');
        }

        // Số vòng đấu = (số đội - 1) x 2
        const soVongDau = (soDoi - 1) * 2;

        // Tạo các vòng đấu
        const vongDauData = [];
        for (let i = 0; i < soVongDau; i++) {
            const luotDau = i < soVongDau / 2 ? 0 : 1; // Lượt đi hoặc lượt về
            const soThuTu = i + 1;
            const maVongDau = `${maMuaGiai}_VD${soThuTu.toString().padStart(2, '0')}`;

            vongDauData.push({
                MaVongDau: maVongDau,
                MaMuaGiai: maMuaGiai,
                LuotDau: luotDau,
                SoThuTu: soThuTu,
                NgayBatDau: null,
                NgayKetThuc: null,
            });
        }

        // Lưu vào cơ sở dữ liệu
        await VongDau.bulkCreate(vongDauData, { ignoreDuplicates: true });

        console.log(`Đã tạo ${soVongDau} vòng đấu cho mùa giải ${maMuaGiai}.`);
    } catch (error) {
        console.error('Lỗi khi tạo vòng đấu:', error.message);
    }
}

module.exports = { taoVongDau };
