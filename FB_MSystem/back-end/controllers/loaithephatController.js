const { LoaiThePhat } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');

const LoaiThePhatController = {
    async getAll(req, res) {
        try {
            const loaiThePhats = await LoaiThePhat.findAll();
            res.status(200).json(loaiThePhats);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách loại thẻ phạt.' });
        }
    },

    async create(req, res) {
        try {
            const { MaLoaiThePhat, TenLoaiThePhat, MoTa } = req.body;
            const isDuplicateName = await isDuplicate(LoaiThePhat, 'TenLoaiThePhat', TenLoaiThePhat);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên loại thẻ phạt "${TenLoaiThePhat}" đã tồn tại.` });
            }
            const loaiThePhat = await LoaiThePhat.create({
                MaLoaiThePhat, TenLoaiThePhat, MoTa,
            });
            res.status(201).json(loaiThePhat);
        } catch (error) {
            console.error("Lỗi khi thêm loại thẻ phạt:", error),
            res.status(500).json({ error: 'Lỗi khi thêm loại thẻ phạt.', details: error.massage });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const loaiThePhat = await LoaiThePhat.findByPk(id);
            if (!loaiThePhat) return res.status(404).json({ error: 'Không tìm thấy loại thẻ phạt.' });
            if (updates.TenLoaiThePhat && updates.TenLoaiThePhat !== loaiThePhat.TenLoaiThePhat) {
                const isDuplicateName = await isDuplicate(LoaiThePhat, 'TenLoaiThePhat', updates.TenLoaiThePhat);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên loại thẻ phạt "${updates.TenLoaiThePhat}" đã tồn tại.` });
                }
            }
            await loaiThePhat.update(updates);
            res.status(200).json(loaiThePhat);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật loại thẻ phạt.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const loaiThePhat = await LoaiThePhat.findByPk(id);
            if (!loaiThePhat) return res.status(404).json({ error: 'Không tìm thấy loại thẻ phạt.' });
            await loaiThePhat.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa loại thẻ phạt.' });
        }
    },
};

module.exports = LoaiThePhatController;
