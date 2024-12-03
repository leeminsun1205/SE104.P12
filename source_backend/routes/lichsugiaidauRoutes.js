// routes/lichsugiaidaus.js
const express = require('express');
const router = express.Router();
const LichSuGiaiDau = require('../models/LichSuGiaiDau');

// Lấy tất cả lịch sử giải đấu
router.get('/', async (req, res) => {
    try {
        const giaiDaus = await LichSuGiaiDau.findAll();
        res.json(giaiDaus);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách lịch sử giải đấu!', error });
    }
});

// Thêm lịch sử giải đấu mới
router.post('/', async (req, res) => {
    try {
        const giaiDau = await LichSuGiaiDau.create(req.body);
        res.status(201).json({ message: 'Thêm giải đấu thành công!', data: giaiDau });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm giải đấu!', error });
    }
});

// Xóa lịch sử giải đấu
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await LichSuGiaiDau.destroy({ where: { MaGiaiDau: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giải đấu!' });
        }
        res.json({ message: 'Xóa giải đấu thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa giải đấu!', error });
    }
});

// Cập nhật lịch sử giải đấu
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await LichSuGiaiDau.update(req.body, {
            where: { MaGiaiDau: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giải đấu để cập nhật!' });
        }

        const updatedGiaiDau = await LichSuGiaiDau.findOne({ where: { MaGiaiDau: id } });
        res.json({ message: 'Cập nhật giải đấu thành công!', data: updatedGiaiDau });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giải đấu!', error });
    }
});

module.exports = router;
