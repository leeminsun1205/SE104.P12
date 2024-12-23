const { UtXepHang, LoaiUuTien, MuaGiai } = require('../models');

const UtXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const data = await UtXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: LoaiUuTien, as: 'LoaiUuTien' },
                ],
            });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách ưu tiên xếp hạng theo mùa giải.' });
        }
    },

    async create(req, res) {
        try {
            const { MaMuaGiai, MaLoaiUuTien, MucDoUuTien } = req.body;
            const utXepHang = await UtXepHang.create({
                MaMuaGiai, MaLoaiUuTien, MucDoUuTien,
            });
            res.status(201).json(utXepHang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm ưu tiên xếp hạng.' });
        }
    },

    async delete(req, res) {
        try {
            const { MaMuaGiai, MaLoaiUuTien } = req.params;
            const utXepHang = await UtXepHang.findOne({
                where: { MaMuaGiai, MaLoaiUuTien },
            });
            if (!utXepHang) return res.status(404).json({ error: 'Không tìm thấy ưu tiên xếp hạng.' });
            await utXepHang.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa ưu tiên xếp hạng.' });
        }
    },
};

module.exports = UtXepHangController;
