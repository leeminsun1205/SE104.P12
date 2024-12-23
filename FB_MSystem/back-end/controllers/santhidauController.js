const { SanThiDau, ThamSo } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');

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
            const isDuplicateName = await isDuplicate(SanThiDau, 'TenSan', TenSan);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên sân "${TenSan}" đã tồn tại.` });
            }
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không thể lấy giá trị tham số từ hệ thống.' });
            }
            if (SucChua < thamSo.SucChuaToiThieu) {
                return res.status(400).json({
                    error: `Sức chứa phải lớn hơn hoặc bằng ${thamSo.SucChuaToiThieu}.`
                });
            }
            if (TieuChuan < thamSo.TieuChuanToiThieu) {
                return res.status(400).json({
                    error: `Tiêu chuẩn phải lớn hơn hoặc bằng ${thamSo.TieuChuanToiThieu}.`
                });
            }
            const sanThiDaus = await SanThiDau.create({
                MaSan, TenSan, DiaChiSan, SucChua, TieuChuan,
            });
            res.status(201).json(sanThiDaus);
        } catch (error) {
            console.error('Lỗi khi thêm sân thi đấu mới:', error);
            res.status(500).json({ error: 'Lỗi khi thêm sân thi đấu mới.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const {TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không thể lấy giá trị tham số từ hệ thống.' });
            }
            const sanThiDaus = await SanThiDau.findByPk(id);
            if (!sanThiDaus) {
                return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            }
            if (TenSan && TenSan !== sanThiDaus.TenSan) {
                const isDuplicateName = await isDuplicate(SanThiDau, 'TenSan', TenSan);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên sân "${TenSan}" đã tồn tại.` });
                }
            }
            if (SucChua != null && SucChua < thamSo.SucChuaToiThieu) {
                return res.status(400).json({
                    error: `Sức chứa phải lớn hơn hoặc bằng ${thamSo.SucChuaToiThieu}.`
                });
            }
            if (TieuChuan != null && TieuChuan < thamSo.TieuChuanToiThieu) {
                return res.status(400).json({
                    error: `Tiêu chuẩn phải lớn hơn hoặc bằng ${thamSo.TieuChuanToiThieu}.`
                });
            }
            await sanThiDaus.update({TenSan, DiaChiSan, SucChua, TieuChuan });
            res.status(200).json(sanThiDaus);
        } catch (error) {
            console.error('Lỗi khi cập nhật sân thi đấu:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật sân thi đấu.', details: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const sanThiDaus = await SanThiDau.findByPk(id);
            if (!sanThiDaus) return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            await sanThiDaus.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa sân thi đấu:', error);
            res.status(500).json({ 
                error: 'Lỗi khi xóa sân thi đấu', 
                details: error.message 
            });
        }
    },
};

module.exports = SanThiDauController;
