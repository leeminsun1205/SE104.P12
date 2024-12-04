const LoaiUuTien = require('../models/LoaiUuTien');

// Lấy danh sách loại ưu tiên
const getLoaiUuTien = async (req, res) => {
    try {
        const LoaiUuTiens = await LoaiUuTien.findAll();
        res.status(200).json(LoaiUuTiens);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách loại ưu tiên.', error: error.message });
    }
};

// Thêm một loại ưu tiên mới
const createLoaiUuTien = async (req, res) => {
    try {
        const { MaLoaiUT, TenLoaiUT } = req.body;

        // Kiểm tra loại ưu tiên đã tồn tại chưa
        const existingLoai = await LoaiUuTien.findOne({ where: { MaLoaiUT } });
        if (existingLoai) {
            return res.status(400).json({ message: 'Mã loại ưu tiên đã tồn tại.' });
        }

        // Thêm loại ưu tiên mới
        const newLoaiUuTien = await LoaiUuTien.create({ MaLoaiUT, TenLoaiUT });

        res.status(201).json({ message: 'Thêm loại ưu tiên thành công.', newLoaiUuTien });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm loại ưu tiên.', error: error.message });
    }
};

// Cập nhật loại ưu tiên
const updateLoaiUuTien = async (req, res) => {
    try {
        const { MaLoaiUT } = req.params;
        const { TenLoaiUT } = req.body;

        // Kiểm tra loại ưu tiên có tồn tại không
        const LoaiUuTien = await LoaiUuTien.findOne({ where: { MaLoaiUT } });
        if (!LoaiUuTien) {
            return res.status(404).json({ message: `Không tìm thấy loại ưu tiên với mã ${MaLoaiUT}.` });
        }

        // Cập nhật tên loại ưu tiên
        LoaiUuTien.TenLoaiUT = TenLoaiUT || LoaiUuTien.TenLoaiUT;
        await LoaiUuTien.save();

        res.status(200).json({ message: `Cập nhật loại ưu tiên với mã ${MaLoaiUT} thành công.`, LoaiUuTien });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật loại ưu tiên.', error: error.message });
    }
};

// Xóa loại ưu tiên
const deleteLoaiUuTien = async (req, res) => {
    try {
        const { MaLoaiUT } = req.params;

        // Kiểm tra loại ưu tiên có tồn tại không
        const deleted = await LoaiUuTien.destroy({ where: { MaLoaiUT } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy loại ưu tiên với mã ${MaLoaiUT}.` });
        }

        res.status(200).json({ message: `Xóa loại ưu tiên với mã ${MaLoaiUT} thành công.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể xóa loại ưu tiên.', error: error.message });
    }
};

module.exports = { getLoaiUuTien, createLoaiUuTien, updateLoaiUuTien, deleteLoaiUuTien };
