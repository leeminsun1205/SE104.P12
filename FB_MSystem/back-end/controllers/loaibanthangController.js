const { LoaiBanThang } = require('../models');

const LoaiBanThangController = {
    async getAll(req, res) {
        try {
            const loaiBanThangs = await LoaiBanThang.findAll();
            res.status(200).json(loaiBanThangs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách loại bàn thắng.' });
        }
    },

    async create(req, res) {
        try {
            const { MaLoaiBanThang, TenLoaiBanThang, MoTa } = req.body;
            const loaiBanThang = await LoaiBanThang.create({
                MaLoaiBanThang, TenLoaiBanThang, MoTa,
            });
            res.status(201).json(loaiBanThang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm loại bàn thắng.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const loaiBanThang = await LoaiBanThang.findByPk(id);
            if (!loaiBanThang) return res.status(404).json({ error: 'Không tìm thấy loại bàn thắng.' });
            await loaiBanThang.update(updates);
            res.status(200).json(loaiBanThang);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật loại bàn thắng.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const loaiBanThang = await LoaiBanThang.findByPk(id);
            if (!loaiBanThang) return res.status(404).json({ error: 'Không tìm thấy loại bàn thắng.' });
            await loaiBanThang.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa loại bàn thắng.' });
        }
    },
};

module.exports = LoaiBanThangController;
