const express = require('express');
const router = express.Router();
const Doibong = require('../models/Doibong'); // Import model Doibong

// Lấy danh sách đội bóng
router.get('/', async (req, res) => {
    try {
        const doibongs = await Doibong.findAll(); // Lấy tất cả đội bóng
        res.json(doibongs); // Trả về danh sách đội bóng
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đội bóng!', error });
    }
});

// Thêm mới đội bóng
router.post('/', async (req, res) => {
    try {
        const doiBong = await Doibong.create(req.body);
        res.status(201).json({ message: 'Thêm đội bóng thành công!', data: doiBong });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm đội bóng!', error });
    }
});

// Xóa đội bóng theo ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Doibong.destroy({ where: { MaDoiBong: id } }); // Sử dụng MaDoiBong làm khóa
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đội bóng!' });
        }
        res.json({ message: 'Xóa đội bóng thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đội bóng!', error });
    }
});

// Cập nhật đội bóng theo ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Doibong.update(req.body, {
            where: { MaDoiBong: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đội bóng để cập nhật!' });
        }

        const updatedDoibong = await Doibong.findOne({ where: { MaDoiBong: id } });
        res.json({ message: 'Cập nhật đội bóng thành công!', data: updatedDoibong });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đội bóng!', error });
    }
});

module.exports = router;
