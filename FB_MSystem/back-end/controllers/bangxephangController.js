const { BangXepHang, DoiBong, VongDau } = require('../models');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: VongDau, as: 'VongDau' },
                ],
            });
            res.status(200).json(bangXepHang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy bảng xếp hạng.' });
        }
    },

    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const bangXepHang = await BangXepHang.findAll({
                where: { MaVongDau },
                include: [{ model: DoiBong, as: 'DoiBong' }],
            });
            res.status(200).json(bangXepHang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy bảng xếp hạng của vòng đấu.' });
        }
    },
};

module.exports = BangXepHangController;
