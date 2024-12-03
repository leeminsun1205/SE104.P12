// routes/thanhtichs.js
const express = require('express');
const router = express.Router();
const ThanhTich = require('../models/ThanhTich');

// Lấy tất cả thành tích
router.get('/', async (req, res) => {
    try {
        const thanhTichs = await ThanhTich.findAll();
        res.json(thanhTichs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thành tích!', error });
    }
});

// Thêm thành tích mới
router.post('/', async (req, res) => {
    try {
        const thanhTich = await ThanhTich.create(req.body);
        res.status(201).json({ message: 'Thêm thành tích thành công!', data: thanhTich });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm thành tích!', error });
    }
});

// Xóa thành tích
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ThanhTich.destroy({ where: { MaThanhTich: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành tích!' });
        }
        res.json({ message: 'Xóa thành tích thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa thành tích!', error });
    }
});

// Cập nhật thành tích
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await ThanhTich.update(req.body, {
            where: { MaThanhTich: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành tích để cập nhật!' });
        }

        const updatedThanhTich = await ThanhTich.findOne({ where: { MaThanhTich: id } });
        res.json({ message: 'Cập nhật thành công!', data: updatedThanhTich });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thành tích!', error });
    }
});

module.exports = router;