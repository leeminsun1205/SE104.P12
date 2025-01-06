const { ThanhTich, DoiBong, MuaGiai, BangXepHang } = require('../models');

const ThanhTichController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const thanhTich = await ThanhTich.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: MuaGiai, as: 'MuaGiai' },
                ],
            });
            res.status(200).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thành tích theo mùa giải.' });
        }
    },

    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const thanhTich = await ThanhTich.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: MuaGiai, as: 'MuaGiai' },
                ],
            });
            res.status(200).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thành tích của đội bóng.' });
        }
    },

    async update(req, res) {
        try {
            const allMuaGiai = await BangXepHang.findAll({
                attributes: ['MaMuaGiai'],
                group: ['MaMuaGiai'], // Lấy danh sách mùa giải duy nhất
            });
            console.log(allMuaGiai)
            if (!allMuaGiai || allMuaGiai.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy mùa giải nào trong bảng xếp hạng.' });
            }
    
            // Lặp qua từng mùa giải để cập nhật thành tích
            for (const muaGiai of allMuaGiai) {
                const { MaMuaGiai } = muaGiai;
    
                // Lấy tất cả đội bóng trong mùa giải hiện tại
                const bangXepHang = await BangXepHang.findAll({
                    where: { MaMuaGiai },
                    attributes: ['MaDoiBong', 'SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'DiemSo', 'HieuSo'],
                    order: [['DiemSo', 'DESC'], ['HieuSo', 'DESC'], ['SoBanThang', 'DESC']],
                });
    
                if (!bangXepHang || bangXepHang.length === 0) {
                    console.warn(`Không tìm thấy đội bóng nào trong bảng xếp hạng cho mùa giải: ${MaMuaGiai}`);
                    continue;
                }
    
                // Tính toán thứ hạng cho từng đội bóng
                const xepHangQuery = `
                    SELECT MaDoiBong, 
                           RANK() OVER (ORDER BY DiemSo DESC, HieuSo DESC, SoBanThang DESC) AS XepHang
                    FROM BangXepHang
                    WHERE MaMuaGiai = :MaMuaGiai
                `;
    
                const xepHangResult = await sequelize.query(xepHangQuery, {
                    replacements: { MaMuaGiai },
                    type: sequelize.QueryTypes.SELECT,
                });
    
                const xepHangMap = {};
                xepHangResult.forEach((item) => {
                    xepHangMap[item.MaDoiBong] = item.XepHang;
                });
    
                // Duyệt qua từng đội bóng trong mùa giải và cập nhật thành tích
                for (const record of bangXepHang) {
                    const { MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua } = record.dataValues;
                    const XepHang = xepHangMap[MaDoiBong];
    
                    // Tìm hoặc tạo mới thành tích cho đội bóng
                    const [thanhTich, created] = await ThanhTich.findOrCreate({
                        where: { MaMuaGiai, MaDoiBong },
                        defaults: {
                            SoTranDaThiDau: SoTran,
                            SoTranThang,
                            SoTranHoa,
                            SoTranThua,
                            XepHang,
                        },
                    });
    
                    // Nếu đã tồn tại, cập nhật giá trị mới
                    if (!created) {
                        await thanhTich.update({
                            SoTranDaThiDau: SoTran,
                            SoTranThang,
                            SoTranHoa,
                            SoTranThua,
                            XepHang,
                        });
                    }
                }
    
            }
    
            res.status(200).json({ message: 'Cập nhật thành tích cho tất cả mùa giải thành công.' });
        } catch (error) {
            console.error('Lỗi khi cập nhật thành tích:', error.message);
            res.status(500).json({ error: 'Lỗi khi cập nhật thành tích.' });
        }
    },
};

module.exports = ThanhTichController;
