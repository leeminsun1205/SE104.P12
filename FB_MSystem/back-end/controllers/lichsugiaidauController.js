const { LichSuGiaiDau, DoiBong } = require('../models');

const LichSuGiaiDauController = {
    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const lichSu = await LichSuGiaiDau.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                ],
            });
            res.status(200).json(lichSu);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy lịch sử giải đấu của đội bóng.' });
        }
    },
};

module.exports = LichSuGiaiDauController;
