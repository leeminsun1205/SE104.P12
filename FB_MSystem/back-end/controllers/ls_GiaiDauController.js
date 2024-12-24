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

    async create(req, res) {
        try {
            const { MaDoiBong, SoLanThamGia, SoLanVoDich, SoLanAQuan, SoLanHangBa, TongSoTran } = req.body;
            const lichSuGiaiDau = await LichSuGiaiDau.create({
                MaDoiBong, SoLanThamGia, SoLanVoDich, SoLanAQuan, SoLanHangBa, TongSoTran
            });
            res.status(201).json(lichSuGiaiDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm lịch sử giải đấu mới.' });
        }
    },

    async update(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const updates = req.body;
            const lichSuGiaiDau = await LichSuGiaiDau.findByPk(MaDoiBong);
            if (!lichSuGiaiDau) return res.status(404).json({ error: 'Không tìm thấy lịch sử giải đấu.' });
            await lichSuGiaiDau.update(updates);
            res.status(200).json(lichSuGiaiDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin lịch sử giải đấu.' });
        }
    },

    async delete(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const lichSuGiaiDau = await LichSuGiaiDau.findByPk(MaDoiBong);
            if (!lichSuGiaiDau) return res.status(404).json({ error: 'Không tìm thấy lịch sử giải đấu.' });
            await lichSuGiaiDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa lịch sử giải đấu.' });
        }
    },
};

module.exports = LichSuGiaiDauController;
