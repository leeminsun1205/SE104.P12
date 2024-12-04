const LichSuGiaiDau = require('../models/lichsugiaidau');

// Lấy danh sách lịch sử giải đấu
const getLichSuGiaiDau = async (req, res) => {
    try {
        const giaiDaus = await LichSuGiaiDau.findAll();
        res.status(200).json(giaiDaus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách lịch sử giải đấu!', details: error.message });
    }
};

// Thêm lịch sử giải đấu mới
const createLichSuGiaiDau = async (req, res) => {
    try {
        const { TenGiaiDau, MaMuaGiai, ThoiGianBatDau, ThoiGianKetThuc } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenGiaiDau || !MaMuaGiai || !ThoiGianBatDau || !ThoiGianKetThuc) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        // Kiểm tra logic ngày
        if (new Date(ThoiGianBatDau) >= new Date(ThoiGianKetThuc)) {
            return res.status(400).json({ message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!' });
        }

        const giaiDau = await LichSuGiaiDau.create({ TenGiaiDau, MaMuaGiai, ThoiGianBatDau, ThoiGianKetThuc });
        res.status(201).json({ message: 'Thêm giải đấu thành công!', data: giaiDau });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm giải đấu!', details: error.message });
    }
};

// Xóa lịch sử giải đấu
const deleteLichSuGiaiDau = async (req, res) => {
    try {
        const { MaGiaiDau } = req.params;

        // Xóa giải đấu
        const result = await LichSuGiaiDau.destroy({ where: { MaGiaiDau } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy giải đấu với mã ${MaGiaiDau}!` });
        }

        res.status(200).json({ message: `Xóa giải đấu với mã ${MaGiaiDau} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa giải đấu!', details: error.message });
    }
};

// Cập nhật lịch sử giải đấu
const updateLichSuGiaiDau = async (req, res) => {
    try {
        const { MaGiaiDau } = req.params;

        // Cập nhật giải đấu
        const [updatedRows] = await LichSuGiaiDau.update(req.body, { where: { MaGiaiDau } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy giải đấu với mã ${MaGiaiDau} để cập nhật!` });
        }

        const updatedGiaiDau = await LichSuGiaiDau.findOne({ where: { MaGiaiDau } });
        res.status(200).json({ message: `Cập nhật giải đấu với mã ${MaGiaiDau} thành công!`, data: updatedGiaiDau });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật giải đấu!', details: error.message });
    }
};

module.exports = { getLichSuGiaiDau, createLichSuGiaiDau, deleteLichSuGiaiDau, updateLichSuGiaiDau };
