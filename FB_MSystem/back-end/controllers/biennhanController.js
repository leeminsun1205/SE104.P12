const { BienNhan, DoiBong, ThamSo } = require('../models');
const { isValidRange } = require('../utils/checkDate');
const BienNhanController = {
    async getAll(req, res) {
        try {
            const bienNhans = await BienNhan.findAll({
                attributes: ['MaBienNhan', 'LePhi', 'NgayBatDau', 'NgayHetHan', 'NgayThanhToan', 'TinhTrang'],
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong'], 
                    },
                ],
            });
            const results = bienNhans.map((bienNhan) => {
                const { DoiBong, ...rest } = bienNhan.get(); 
                return {
                    ...rest,
                    TenDoiBong: DoiBong ? DoiBong.TenDoiBong : null, 
                };
            });
    
            res.status(200).json(results);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách biên nhận:', error.message);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách biên nhận.' });
        }
    },

    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const bienNhans = await BienNhan.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                ],
            });
            res.status(200).json(bienNhans);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách biên nhận của đội bóng.' });
        }
    },

    async create(req, res) {
        try {
            const { MaBienNhan, MaDoiBong, NgayThanhToan, TinhTrang } = req.body;
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không tìm thấy giá trị tham số trong hệ thống.' });
            }
            const LePhi = thamSo.LePhi; 
            const NgayBatDau = thamSo.NgayBatDauLePhi;
            const NgayHetHan = thamSo.NgayHetHanLePhi;
            const bienNhan = await BienNhan.create({
                MaBienNhan,
                MaDoiBong,
                LePhi,
                NgayBatDau,
                NgayHetHan,
                NgayThanhToan,
                TinhTrang,
            });
    
            res.status(201).json(bienNhan);
        } catch (error) {
            console.error('Lỗi khi thêm biên nhận mới:', error);
            res.status(500).json({ error: 'Lỗi khi thêm biên nhận mới.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { NgayThanhToan, ...updates } = req.body;
    
            // Tìm biên nhận theo ID
            const bienNhan = await BienNhan.findByPk(id);
            if (!bienNhan) {
                return res.status(404).json({ error: 'Không tìm thấy biên nhận.' });
            }
    
            // Ngăn cập nhật trực tiếp TinhTrang
            if ('TinhTrang' in updates) {
                return res.status(400).json({ error: 'Không được phép cập nhật trực tiếp TinhTrang.' });
            }
    
            // Kiểm tra logic ngày thanh toán
            if (NgayThanhToan !== undefined) {
                if (NgayThanhToan === null) {
                    updates.NgayThanhToan = null;
                    updates.TinhTrang = false; // Đặt TinhTrang thành false nếu NgayThanhToan là null
                } else {
                    const ngayThanhToan = new Date(NgayThanhToan);
                    const ngayBatDau = new Date(bienNhan.NgayBatDau);
                    const ngayHetHan = new Date(bienNhan.NgayHetHan);
    
                    if (ngayThanhToan < ngayBatDau || ngayThanhToan > ngayHetHan) {
                        return res.status(400).json({
                            error: 'Ngày thanh toán phải nằm trong khoảng từ Ngày bắt đầu đến Ngày hết hạn.',
                        });
                    }
    
                    updates.NgayThanhToan = ngayThanhToan;
                    updates.TinhTrang = true; // Đặt TinhTrang thành true nếu NgayThanhToan hợp lệ
                }
            }
    
            // Cập nhật biên nhận
            await bienNhan.update(updates);
    
            res.status(200).json(bienNhan);
        } catch (error) {
            console.error('Lỗi khi cập nhật biên nhận:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật biên nhận.', details: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const bienNhan = await BienNhan.findByPk(id);
            if (!bienNhan) return res.status(404).json({ error: 'Không tìm thấy biên nhận.' });
            await bienNhan.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa biên nhận.' });
        }
    },
};

module.exports = BienNhanController;
