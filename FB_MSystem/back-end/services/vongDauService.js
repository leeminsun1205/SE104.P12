const { VongDau, DoiBong, MgDbCt } = require('../models');

async function taoVongDau(maMuaGiai) {
    try {
        // Lấy danh sách đội bóng thuộc mùa giải
        const doiBongTrongMua = await MgDbCt.findAll({
            where: { MaMuaGiai: maMuaGiai },
            attributes: ['MaDoiBong'], // Chỉ lấy MaDoiBong để tránh dư thừa dữ liệu
            group: ['MaDoiBong'], // Lọc các đội bóng duy nhất
            include: [
                {
                    model: DoiBong,
                    as: 'DoiBong',
                },
            ],
        });

        const soDoi = doiBongTrongMua.length;
        console.log('Đội bóng trong mùa giải:', doiBongTrongMua);
        console.log('Số đội bóng tính được:', soDoi);
        if (soDoi < 2) {
            throw new Error('Mùa giải phải có ít nhất 2 đội bóng để tạo vòng đấu.');
        }

        // Số vòng đấu = (số đội - 1) x 2
        const soVongDau = (soDoi - 1) * 2;

        // Tạo các vòng đấu
        const vongDauData = [];
        for (let i = 0; i < soVongDau; i++) {
            const luotDau = i < soVongDau / 2 ? 0 : 1; // 0 = Lượt đi, 1 = Lượt về
            const soThuTu = i + 1;
            const maVongDau = `${maMuaGiai}_VD${soThuTu.toString().padStart(2, '0')}`;

            // Thêm logic ngày nếu cần (ví dụ: mỗi vòng đấu cách nhau 7 ngày)
            const ngayBatDau = null; // Hoặc logic ngày cụ thể
            const ngayKetThuc = null;

            vongDauData.push({
                MaVongDau: maVongDau,
                MaMuaGiai: maMuaGiai,
                LuotDau: luotDau,
                SoThuTu: soThuTu,
                NgayBatDau: ngayBatDau,
                NgayKetThuc: ngayKetThuc,
            });
        }

        // Lưu vào cơ sở dữ liệu
        await VongDau.bulkCreate(vongDauData, { ignoreDuplicates: true });

        console.log(`Đã tạo ${soVongDau} vòng đấu cho mùa giải ${maMuaGiai}.`);
        return vongDauData; // Trả về danh sách vòng đấu đã tạo
    } catch (error) {
        console.error('Lỗi khi tạo vòng đấu:', error.message);
        throw error; // Ném lỗi để controller xử lý
    }
}

module.exports = { taoVongDau };
