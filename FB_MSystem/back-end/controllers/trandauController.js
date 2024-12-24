const { TranDau } = require('../models');
const { taoTranDau} = require('../services/tranDauService')
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
            const { MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang } = req.body;
            const tranDau = await TranDau.create({
                MaTranDau, MaVongDau, MaDoiBongNha, MaDoiBongKhach, MaSan, NgayThiDau, GioThiDau, BanThangDoiNha, BanThangDoiKhach, TinhTrang,
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
    async createMatchesBySeason(req, res) {
        try {
            const { maMuaGiai } = req.params;
    
            if (!maMuaGiai) {
                return res.status(400).json({ error: 'Thiếu mã mùa giải trong yêu cầu.' });
            }
    
            const tranDauData = await taoTranDau(maMuaGiai);
    
            res.status(201).json({
                message: `Đã tạo ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`,
                data: tranDauData,
            });
        } catch (error) {
            res.status(500).json({
                error: 'Lỗi khi tạo trận đấu.',
                details: error.message,
            });
        }
    }
};

module.exports = TranDauController;
