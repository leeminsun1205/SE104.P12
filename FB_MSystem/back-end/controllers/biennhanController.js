const { BienNhan, DoiBong, ThamSo } = require('../models');

const BienNhanController = {
    async getAll(req, res) {
        try {
            const bienNhans = await BienNhan.findAll({
                attributes: ['MaBienNhan', 'LePhi', 'NgayThanhToan', 'LyDo', 'SoTienDaNhan', 'TinhTrang'],
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong', 'MaDoiBong'], 
                    },
                ],
            });
            const results = bienNhans.map((bienNhan) => {
                const { DoiBong, ...rest } = bienNhan.get(); 
                return {
                    ...rest,
                    MaDoiBong: DoiBong ? DoiBong.MaDoiBong : null, 
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
            const { MaBienNhan, MaDoiBong, NgayThanhToan, SoTienDaNhan, TinhTrang } = req.body;
            const thamSo = await ThamSo.findOne();
            if (!thamSo) {
                return res.status(500).json({ error: 'Không tìm thấy giá trị tham số trong hệ thống.' });
            }
            const LePhi = thamSo.LePhi; 
            const bienNhan = await BienNhan.create({
                MaBienNhan,
                MaDoiBong,
                LePhi,
                NgayThanhToan,
                SoTienDaNhan,
                TinhTrang,
                LyDo,
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
