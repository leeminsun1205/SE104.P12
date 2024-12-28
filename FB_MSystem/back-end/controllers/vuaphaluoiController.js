const { VuaPhaLuoi, CauThu, MuaGiai, DoiBong } = require('../models');

const VuaPhaLuoiController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;

            // Kiểm tra thông tin đầu vào
            if (!MaMuaGiai) {
                return res.status(400).json({ error: 'Thiếu mã mùa giải trong yêu cầu.' });
            }

            // Lấy danh sách vua phá lưới
            const vuaPhaLuoi = await VuaPhaLuoi.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['MaDoiBong', 'TenDoiBong'], // Lấy các cột cần thiết
                    },
                    {
                        model: CauThu,
                        as: 'CauThu',
                        attributes: ['MaCauThu', 'TenCauThu'], // Lấy các cột cần thiết
                    },
                    // {
                    //     model: MuaGiai,
                    //     as: 'MuaGiai',
                    //     attributes: ['MaMu   aGiai', 'TenMuaGiai'], // Lấy các cột cần thiết
                    // },
                ],
                order: [['SoBanThang', 'DESC']], // Sắp xếp theo số bàn thắng giảm dần
            });

            // Kiểm tra nếu không có dữ liệu
            if (!vuaPhaLuoi || vuaPhaLuoi.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy dữ liệu vua phá lưới cho mùa giải này.' });
            }

            res.status(200).json(vuaPhaLuoi);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách vua phá lưới:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vua phá lưới theo mùa giải.' });
        }
    },

    async getAllMuaGiai(req, res) {
        try {
            const allMuaGiai = await MuaGiai.findAll();

            if (!allMuaGiai || allMuaGiai.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy dữ liệu mùa giải nào.' });
            }

            res.status(200).json(allMuaGiai);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách tất cả các mùa giải.' });
        }
    },
};

module.exports = VuaPhaLuoiController;