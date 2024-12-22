const { ThamSo } = require('../models');

const ThamSoController = {
    async getAll(req, res) {
        try {
            const thamSos = await ThamSo.findAll();
            res.status(200).json(thamSos);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách tham số.' });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
            const thamSo = await ThamSo.findOne();
            if (!thamSo) return res.status(404).json({ error: 'Không tìm thấy tham số.' });
            await thamSo.update(updates);
            res.status(200).json(thamSo);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật tham số.' });
        }
    },
};

module.exports = ThamSoController;
