const { VuaPhaLuoi, CauThu, MuaGiai } = require('../models');

const VuaPhaLuoiController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const vuaPhaLuoi = await VuaPhaLuoi.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: MuaGiai, as: 'MuaGiai' },
                ],
                order: [['SoBanThang', 'DESC']],
            });
            res.status(200).json(vuaPhaLuoi);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vua phá lưới theo mùa giải.' });
        }
    },
};

module.exports = VuaPhaLuoiController;
