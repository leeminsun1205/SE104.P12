const { SanThiDau } = require('../models');

const SanThiDauController = {
    async getAll(req, res) {
        try {
            const sanThiDaus = await SanThiDau.findAll();
            res.status(200).json(sanThiDaus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách sân thi đấu.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const sanThiDau = await SanThiDau.findByPk(id);
            if (!sanThiDau) return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            res.status(200).json(sanThiDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin sân thi đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;
            const sanThiDau = await SanThiDau.create({
                MaSan, TenSan, DiaChiSan, SucChua, TieuChuan,
            });
            res.status(201).json(sanThiDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm sân thi đấu mới.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const sanThiDau = await SanThiDau.findByPk(id);
            if (!sanThiDau) return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            await sanThiDau.update(updates);
            res.status(200).json(sanThiDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin sân thi đấu.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const sanThiDau = await SanThiDau.findByPk(id);
            if (!sanThiDau) return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            await sanThiDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa sân thi đấu.' });
        }
    },
};

module.exports = SanThiDauController;
