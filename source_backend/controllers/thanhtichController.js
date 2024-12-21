const { ThanhTich, DoiBong, MuaGiai } = require('../models');

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
};

module.exports = ThanhTichController;
