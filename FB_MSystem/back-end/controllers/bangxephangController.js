const { UUID } = require('sequelize');
const { BangXepHang, DoiBong, UtXepHang } = require('../models');
const LoaiUuTien = require('../models/loaiuutien');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const utxh = UtXepHang;
            // Lấy danh sách tiêu chí xếp hạng (tầm quan trọng được xác định bởi MucDoUuTien)
            const tieuChiXepHang = await utxh.findAll({
                where: { MaMuaGiai },
                attributes: ['MaLoaiUuTien', 'MucDoUuTien'],
                order: [['MucDoUuTien', 'ASC']],  // Sắp xếp theo tầm quan trọng (MucDoUuTien tăng dần)
            });

            // Nếu không có tiêu chí xếp hạng, trả về lỗi
            if (!tieuChiXepHang || tieuChiXepHang.length === 0) {
                return res.status(400).json({ message: 'Không có tiêu chí xếp hạng cho mùa giải này.' });
            }

            // Tạo mảng các tiêu chí sắp xếp (theo thứ tự giảm dần mặc định)
            const orderBy = tieuChiXepHang.map(tieuChi => [tieuChi.MaLoaiUuTien, 'DESC']);

            // Danh sách các cột hợp lệ trong bảng xếp hạng
            const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];

            // Kiểm tra tính hợp lệ của các tiêu chí
            for (const [column, _] of orderBy) {
                if (!validSortColumns.includes(column)) {
                    return res.status(400).json({ message: `Cột sắp xếp không hợp lệ: ${column}` });
                }
            }

            // Truy vấn bảng xếp hạng
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',  // Đảm bảo alias khớp với alias trong định nghĩa BangXepHang
                        attributes: ['TenDoiBong'],  // Chỉ lấy thuộc tính TenDoiBong của DoiBong
                    },
                ],
                attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],  // Lấy các thuộc tính từ BangXepHang
                order: orderBy,  // Sắp xếp theo các tiêu chí đã được cấu hình, mặc định giảm dần
            });

            // Kiểm tra nếu không tìm thấy bảng xếp hạng
            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }

            // Trả về kết quả bảng xếp hạng
            res.status(200).json(bangXepHang);
        } catch (error) {
            console.error('Lỗi khi truy vấn bảng xếp hạng:', error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = BangXepHangController;
