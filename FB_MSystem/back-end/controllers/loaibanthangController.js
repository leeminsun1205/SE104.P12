const { LoaiBanThang } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');

const LoaiBanThangController = {
    async getAll(req, res) {
        try {
            const loaiBanThangs = await LoaiBanThang.findAll();
            res.status(200).json(loaiBanThangs);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại bàn thắng:', error.message);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách loại bàn thắng.', details: error.message });
        }
    },

    async create(req, res) {
        try {
            const { MaLoaiBanThang, TenLoaiBanThang, MoTa } = req.body;
            const isDuplicateName = await isDuplicate(LoaiBanThang, 'TenLoaiBanThang', TenLoaiBanThang);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên loại bàn thắng "${TenLoaiBanThang}" đã tồn tại.` });
            }
            const loaiBanThang = await LoaiBanThang.create({
                MaLoaiBanThang, TenLoaiBanThang, MoTa,
            });
            res.status(201).json(loaiBanThang);
        } catch (error) {
            console.error('Lỗi khi thêm loại bàn thắng:', error.message);
            res.status(500).json({ error: 'Lỗi khi thêm loại bàn thắng.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { MaLoaiBanThang, TenLoaiBanThang, MoTa } = req.body;
            const loaiBanThang = await LoaiBanThang.findByPk(id);
            if (!loaiBanThang) return res.status(404).json({ error: 'Không tìm thấy loại bàn thắng.' });
            if (TenLoaiBanThang && TenLoaiBanThang !== loaiBanThang.TenLoaiBanThang) {
                const isDuplicateName = await isDuplicate(LoaiBanThang, 'TenLoaiBanThang', TenLoaiBanThang);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên loại bàn thắng "${TenLoaiBanThang}" đã tồn tại.` });
                }
            }
            await loaiBanThang.update({ MaLoaiBanThang, TenLoaiBanThang, MoTa });
            res.status(200).json(loaiBanThang);
        } catch (error) {
            console.error('Lỗi khi cập nhật loại bàn thắng:', error.message);
            res.status(500).json({ error: 'Lỗi khi cập nhật loại bàn thắng.', details: error.message });
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
            console.error('Lỗi khi xóa loại bàn thắng:', error.message);
            res.status(500).json({ error: 'Lỗi khi xóa loại bàn thắng.', details: error.message });
        }
    },
};

module.exports = LoaiBanThangController;
