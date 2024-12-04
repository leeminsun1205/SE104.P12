const VongDau = require('../models/vongdau');

// Lấy danh sách vòng đấu
const getVongDau = async (req, res) => {
    try {
        const vongDaus = await VongDau.findAll();
        res.status(200).json(vongDaus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Không thể lấy danh sách vòng đấu.', details: err.message });
    }
};

// Tạo vòng đấu mới
const createVongDau = async (req, res) => {
    try {
        const { MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaVongDau || !MaMuaGiai || !LuotDau || !SoThuTu || !NgayBatDau || !NgayKetThuc) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        // Kiểm tra logic ngày
        if (new Date(NgayBatDau) >= new Date(NgayKetThuc)) {
            return res.status(400).json({ message: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.' });
        }

        const newVongDau = await VongDau.create({
            MaVongDau,
            MaMuaGiai,
            LuotDau,
            SoThuTu,
            NgayBatDau,
            NgayKetThuc
        });

        res.status(201).json({ message: 'Tạo vòng đấu thành công!', data: newVongDau });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Không thể tạo vòng đấu mới.', details: err.message });
    }
};

// Xóa vòng đấu
const deleteVongDau = async (req, res) => {
    try {
        const { MaVongDau } = req.params;

        // Xóa vòng đấu
        const deleted = await VongDau.destroy({ where: { MaVongDau } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy vòng đấu với mã ${MaVongDau}.` });
        }

        res.status(200).json({ message: `Xóa vòng đấu với mã ${MaVongDau} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa vòng đấu.', details: error.message });
    }
};

module.exports = { getVongDau, createVongDau, deleteVongDau };
