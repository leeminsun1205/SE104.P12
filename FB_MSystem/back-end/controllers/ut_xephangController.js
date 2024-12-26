const { UtXepHang, LoaiUuTien } = require('../models');

const UtXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const data = await UtXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: LoaiUuTien, as: 'LoaiUuTien' },
                ],
                order: [['MucDoUuTien', 'ASC']],  // Sắp xếp theo thứ tự ưu tiên
            });
            res.status(200).json(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ưu tiên xếp hạng theo mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách ưu tiên xếp hạng theo mùa giải.' });
        }
    },

    async create(req, res) {
        try {
            const { MaMuaGiai, MaLoaiUuTien, MucDoUuTien } = req.body;
            const utXepHang = await UtXepHang.create({
                MaMuaGiai, MaLoaiUuTien, MucDoUuTien,
            });
            res.status(201).json(utXepHang);
        } catch (error) {
            console.error('Lỗi khi thêm ưu tiên xếp hạng:', error);
            res.status(500).json({ error: 'Lỗi khi thêm ưu tiên xếp hạng.' });
        }
    },

    async updateTieuChi(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { tieuChi } = req.body;  // tieuChi sẽ chứa các tiêu chí mới mà người dùng muốn cập nhật

            // Xóa các tiêu chí cũ
            await UtXepHang.destroy({ where: { MaMuaGiai } });

            // Tạo mới các tiêu chí xếp hạng
            for (const { MaLoaiUuTien, MucDoUuTien } of tieuChi) {
                await UtXepHang.create({
                    MaMuaGiai,
                    MaLoaiUuTien,
                    MucDoUuTien
                });
            }

            res.status(200).json({ message: 'Cập nhật tiêu chí xếp hạng thành công.' });
        } catch (error) {
            console.error('Lỗi khi cập nhật tiêu chí xếp hạng:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật tiêu chí xếp hạng.' });
        }
    },

    async delete(req, res) {
        try {
            const { MaMuaGiai, MaLoaiUuTien } = req.params;
            const utXepHang = await UtXepHang.findOne({
                where: { MaMuaGiai, MaLoaiUuTien },
            });
            if (!utXepHang) return res.status(404).json({ error: 'Không tìm thấy ưu tiên xếp hạng.' });
            await utXepHang.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa ưu tiên xếp hạng.' });
        }
    },
};

module.exports = UtXepHangController;
