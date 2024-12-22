const { TranDau } = require('../models');

const TranDauController = {
    async getAll(req, res) {
        try {
            const tranDaus = await TranDau.findAll();
            res.status(200).json(tranDaus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách trận đấu.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            res.status(200).json(tranDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin trận đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach } = req.body;
            const tranDau = await TranDau.create({
                MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach,
            });
            res.status(201).json(tranDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm trận đấu mới.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            await tranDau.update(updates);
            res.status(200).json(tranDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin trận đấu.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const tranDau = await TranDau.findByPk(id);
            if (!tranDau) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
            await tranDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa trận đấu.' });
        }
    },
};

module.exports = TranDauController;
