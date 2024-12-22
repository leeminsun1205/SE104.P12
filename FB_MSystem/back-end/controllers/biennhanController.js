const { BienNhan, DoiBong, ThamSo } = require('../models');
const { isValidRange } = require('../utils/kiemTraNgay');
const BienNhanController = {
    async getAll(req, res) {
        try {
            const bienNhans = await BienNhan.findAll({
                attributes: ['MaLePhi', 'SoTien', 'NgayBatDau', 'NgayHetHan', 'NgayThanhToan', 'TinhTrang'], // Các cột của Biên Nhận
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong'], // Chỉ lấy TenDoiBong từ bảng DoiBong
                    },
                ],
            });
    
            // Chuyển đổi kết quả để chỉ lấy TenDoiBong
            const results = bienNhans.map((bienNhan) => {
                const { DoiBong, ...rest } = bienNhan.get(); // Loại bỏ DoiBong
                return {
                    ...rest,
                    TenDoiBong: DoiBong ? DoiBong.TenDoiBong : null, // Lấy TenDoiBong từ DoiBong
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
            const { MaLePhi, MaDoiBong, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang } = req.body;
    
            // Kiểm tra ngày hợp lệ
            if (!isValidRange(NgayBatDau, NgayHetHan)) {
                return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày hết hạn.' });
            }
    
            // Lấy giá trị SoTien từ bảng THAMSO
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không tìm thấy giá trị tham số trong hệ thống.' });
            }
            const SoTien = thamSo.LePhi; // Lấy giá trị LePhi từ THAMSO
    
            // Tạo biên nhận với giá trị SoTien từ THAMSO
            const bienNhan = await BienNhan.create({
                MaLePhi,
                MaDoiBong,
                SoTien,
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
            const { id } = req.params; // Lấy ID biên nhận từ URL
            const { NgayThanhToan, ...updates } = req.body;
    
            // Lấy biên nhận cần cập nhật
            const bienNhan = await BienNhan.findByPk(id);
            if (!bienNhan) {
                return res.status(404).json({ error: 'Không tìm thấy biên nhận.' });
            }
    
            // Ngăn chặn cập nhật trực tiếp TinhTrang
            if ('TinhTrang' in updates) {
                return res.status(400).json({ error: 'Không được phép cập nhật trực tiếp TinhTrang.' });
            }
    
            // Kiểm tra và xử lý NgayThanhToan
            if (NgayThanhToan) {
                const ngayThanhToan = new Date(NgayThanhToan);
                const ngayBatDau = new Date(bienNhan.NgayBatDau);
                const ngayHetHan = new Date(bienNhan.NgayHetHan);
    
                // Kiểm tra NgayThanhToan có nằm trong khoảng hợp lệ không
                if (ngayThanhToan < ngayBatDau || ngayThanhToan > ngayHetHan) {
                    return res.status(400).json({
                        error: 'Ngày thanh toán phải nằm trong khoảng từ Ngày bắt đầu đến Ngày hết hạn.',
                    });
                }
    
                // Cập nhật NgayThanhToan và tự động đặt TinhTrang thành true
                updates.NgayThanhToan = ngayThanhToan;
                updates.TinhTrang = true;
            }
    
            // Cập nhật các giá trị khác
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
