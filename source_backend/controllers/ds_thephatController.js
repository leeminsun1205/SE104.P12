const { DsThePhat, CauThu, VongDau } = require('../models');

const DsThePhatController = {
    async getByVongDau(req, res) {
        try {
            const { MaVongDau } = req.params;
            const dsThePhat = await DsThePhat.findAll({
                where: { MaVongDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: VongDau, as: 'VongDau' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo vòng đấu.' });
        }
    },

    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const dsThePhat = await DsThePhat.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: CauThu, as: 'CauThu' },
                ],
            });
            res.status(200).json(dsThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt theo mùa giải.' });
        }
    },
};

module.exports = DsThePhatController;
