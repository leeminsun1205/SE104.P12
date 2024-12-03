// controllers/lichSuGiaiDauController.js
const LichSuGiaiDau = require('../models/LichSuGiaiDau');

// Lấy danh sách lịch sử giải đấu
const getLichSuGiaiDau = async (req, res) => {
    try {
        const lichSuGiaiDau = await LichSuGiaiDau.findAll();
        res.status(200).json(lichSuGiaiDau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách lịch sử giải đấu' });
    }
};

// Tạo mới lịch sử giải đấu
const createLichSuGiaiDau = async (req, res) => {
    try {
        const { MaDoiBong, SoLanThamGia, SoTranThang, SoLanVoDich, SoLanAQuan, SoLanHangBa } = req.body;
        const newLichSuGiaiDau = await LichSuGiaiDau.create({ MaDoiBong, SoLanThamGia, SoTranThang, SoLanVoDich, SoLanAQuan, SoLanHangBa });
        res.status(201).json(newLichSuGiaiDau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới lịch sử giải đấu' });
    }
};

// Xóa lịch sử giải đấu
const deleteLichSuGiaiDau = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const deleted = await LichSuGiaiDau.destroy({
            where: { MaDoiBong: MaDoiBong }
        });

        if (deleted) {
            res.status(200).json({ message: `Lịch sử giải đấu của đội bóng với mã ${MaDoiBong} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy lịch sử giải đấu của đội bóng với mã ${MaDoiBong}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa lịch sử giải đấu.', error: error.message });
    }
};

module.exports = { getLichSuGiaiDau, createLichSuGiaiDau, deleteLichSuGiaiDau };
