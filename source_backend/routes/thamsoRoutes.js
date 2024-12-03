// routes/thamsos.js
const express = require('express');
const router = express.Router();
const ThamSo = require('../models/ThamSo');

// Lấy tất cả tham số
router.get('/', async (req, res) => {
    try {
        const thamsos = await ThamSo.findAll();
        res.json(thamsos);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tham số!', error });
    }
});

// Thêm tham số mới
router.post('/', async (req, res) => {
    try {
        const thamSo = await ThamSo.create(req.body);
        res.status(201).json({ message: 'Thêm tham số thành công!', data: thamSo });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm tham số!', error });
    }
});

// Xóa tham số
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ThamSo.destroy({ where: { MaThamSo: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tham số!' });
        }
        res.json({ message: 'Xóa tham số thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tham số!', error });
    }
});

// Cập nhật tham số
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await ThamSo.update(req.body, {
            where: { MaThamSo: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tham số để cập nhật!' });
        }

        const updatedThamSo = await ThamSo.findOne({ where: { MaThamSo: id } });
        res.json({ message: 'Cập nhật tham số thành công!', data: updatedThamSo });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật tham số!', error });
    }
});

module.exports = router;
