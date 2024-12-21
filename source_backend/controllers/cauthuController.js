const { CauThu } = require('../models');

const CauThuController = {
    async getAll(req, res) {
        try {
            const cauThus = await CauThu.findAll();
            res.status(200).json(cauThus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ.' , details: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
            res.status(200).json(cauThu);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin cầu thủ.' });
        }
    },

    async create(req, res) {
        try {
            const { MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu, AnhCauThu } = req.body;
            const cauThu = await CauThu.create({
                MaCauThu, TenCauThu, NgaySinh, QuocTich, LoaiCauThu, ViTri, ChieuCao, CanNang, SoAo, TieuSu, AnhCauThu,
            });
            res.status(201).json(cauThu);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm cầu thủ mới.' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
            await cauThu.update(updates);
            res.status(200).json(cauThu);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin cầu thủ.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const cauThu = await CauThu.findByPk(id);
            if (!cauThu) return res.status(404).json({ error: 'Không tìm thấy cầu thủ.' });
            await cauThu.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa cầu thủ.' });
        }
    },
};

module.exports = CauThuController;
