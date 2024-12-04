const UT_XepHang = require('../models/ut_xephang');

// Lấy danh sách ưu tiên xếp hạng
const getUT_XepHang = async (req, res) => {
    try {
        const utXephang = await UT_XepHang.findAll();
        res.status(200).json(utXephang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ưu tiên xếp hạng!', details: error.message });
    }
};

// Thêm ưu tiên xếp hạng mới
const createUT_XepHang = async (req, res) => {
    try {
        const { MaMuaGiai, MaLoaiUT, MucDoUT } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaMuaGiai || !MaLoaiUT || MucDoUT === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const utXephang = await UT_XepHang.create({ MaMuaGiai, MaLoaiUT, MucDoUT });
        res.status(201).json({ message: 'Thêm ưu tiên xếp hạng thành công!', data: utXephang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm ưu tiên xếp hạng!', details: error.message });
    }
};

// Xóa ưu tiên xếp hạng
const deleteUT_XepHang = async (req, res) => {
    try {
        const { MaMuaGiai, MaLoaiUT } = req.params;

        // Xóa ưu tiên xếp hạng
        const result = await UT_XepHang.destroy({ where: { MaMuaGiai, MaLoaiUT } });
        if (result === 0) {
            return res.status(404).json({ message: `Không tìm thấy ưu tiên xếp hạng với mã mùa giải ${MaMuaGiai} và mã loại ưu tiên ${MaLoaiUT}!` });
        }

        res.status(200).json({ message: `Xóa ưu tiên xếp hạng với mã mùa giải ${MaMuaGiai} và mã loại ưu tiên ${MaLoaiUT} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa ưu tiên xếp hạng!', details: error.message });
    }
};

// Cập nhật ưu tiên xếp hạng
const updateUT_XepHang = async (req, res) => {
    try {
        const { MaMuaGiai, MaLoaiUT } = req.params;
        const { MucDoUT } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (MucDoUT === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin để cập nhật!' });
        }

        // Cập nhật ưu tiên xếp hạng
        const [updatedRows] = await UT_XepHang.update({ MucDoUT }, { where: { MaMuaGiai, MaLoaiUT } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy ưu tiên xếp hạng với mã mùa giải ${MaMuaGiai} và mã loại ưu tiên ${MaLoaiUT} để cập nhật!` });
        }

        const updatedUT_XepHang = await UT_XepHang.findOne({ where: { MaMuaGiai, MaLoaiUT } });
        res.status(200).json({ message: `Cập nhật ưu tiên xếp hạng với mã mùa giải ${MaMuaGiai} và mã loại ưu tiên ${MaLoaiUT} thành công!`, data: updatedUT_XepHang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật ưu tiên xếp hạng!', details: error.message });
    }
};

module.exports = { getUT_XepHang, createUT_XepHang, deleteUT_XepHang, updateUT_XepHang };
