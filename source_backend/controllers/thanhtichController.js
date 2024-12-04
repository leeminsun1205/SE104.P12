const ThanhTich = require('../models/thanhtich');

// Lấy danh sách thành tích
const getThanhTich = async (req, res) => {
    try {
        const thanhTichs = await ThanhTich.findAll();
        res.status(200).json(thanhTichs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thành tích!', details: error.message });
    }
};

// Thêm thành tích mới
const createThanhTich = async (req, res) => {
    try {
        const { TenThanhTich, MoTa, MaDoiBong, MaMuaGiai } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenThanhTich || !MaDoiBong || !MaMuaGiai) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const thanhTich = await ThanhTich.create({ TenThanhTich, MoTa, MaDoiBong, MaMuaGiai });
        res.status(201).json({ message: 'Thêm thành tích thành công!', data: thanhTich });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm thành tích!', details: error.message });
    }
};

// Xóa thành tích
const deleteThanhTich = async (req, res) => {
    try {
        const { MaThanhTich } = req.params;

        // Xóa thành tích
        const result = await ThanhTich.destroy({ where: { MaThanhTich } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy thành tích với mã ${MaThanhTich}!` });
        }

        res.status(200).json({ message: `Xóa thành tích với mã ${MaThanhTich} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa thành tích!', details: error.message });
    }
};

// Cập nhật thành tích
const updateThanhTich = async (req, res) => {
    try {
        const { MaThanhTich } = req.params;
        const { TenThanhTich, MoTa, MaDoiBong, MaMuaGiai } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenThanhTich && !MoTa && !MaDoiBong && !MaMuaGiai) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật thành tích
        const [updatedRows] = await ThanhTich.update({ TenThanhTich, MoTa, MaDoiBong, MaMuaGiai }, { where: { MaThanhTich } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy thành tích với mã ${MaThanhTich} để cập nhật!` });
        }

        const updatedThanhTich = await ThanhTich.findOne({ where: { MaThanhTich } });
        res.status(200).json({ message: `Cập nhật thành tích với mã ${MaThanhTich} thành công!`, data: updatedThanhTich });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thành tích!', details: error.message });
    }
};

module.exports = { getThanhTich, createThanhTich, deleteThanhTich, updateThanhTich };
