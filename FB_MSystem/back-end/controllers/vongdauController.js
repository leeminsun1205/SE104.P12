const { VongDau } = require('../models');

const VongDauController = {
    async getAll(req, res) {
        try {
            const vongDaus = await VongDau.findAll();
            res.status(200).json(vongDaus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vòng đấu.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            res.status(200).json(vongDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin vòng đấu.' });
        }
    },

    async create(req, res) {
        try {
            const { MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc } = req.body;
            const vongDau = await VongDau.create({
                MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc,
            });
            res.status(201).json(vongDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm vòng đấu.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            await vongDau.update(updates);
            res.status(200).json(vongDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật vòng đấu.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            await vongDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa vòng đấu.' });
        }
    },
};

module.exports = VongDauController;
