const { DoiBong } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');
const DoiBongController = {
    async getAll(req, res) {
        try {
            const doiBongs = await DoiBong.findAll();
            res.status(200).json(doiBongs);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đội bóng.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            res.status(200).json(doiBong);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin đội bóng.' });
        }
    },

    async create(req, res) {
        try {
            const { MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin, Logo } = req.body;
            const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', TenDoiBong);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên đội bóng "${TenDoiBong}" đã tồn tại.` });
            }
            const doiBong = await DoiBong.create({
                MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin, Logo,
            });
            res.status(201).json(doiBong);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm đội bóng mới.', details: error.massage});
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            if (updates.TenDoiBong && updates.TenDoiBong !== doiBong.TenDoiBong) {
                const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', updates.TenDoiBong);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên đội bóng "${updates.TenDoiBong}" đã tồn tại.` });
                }
            }
            await doiBong.update(updates);
            res.status(200).json(doiBong);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin đội bóng.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            await doiBong.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa đội bóng.' });
        }
    },
};

module.exports = DoiBongController;
