// routes/loaithephat.js
const express = require('express');
const router = express.Router();
const ThePhat = require('../models/LoaiThePhat');

// Lấy tất cả loại thẻ phạt
router.get('/', async (req, res) => {
    try {
        const thephats = await ThePhat.findAll();
        res.json(thephats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách loại thẻ phạt!', error });
    }
});

// Thêm loại thẻ phạt mới
router.post('/', async (req, res) => {
    try {
        const thePhat = await ThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm loại thẻ phạt thành công!', data: thePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm loại thẻ phạt!', error });
    }
});

// Xóa loại thẻ phạt
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ThePhat.destroy({ where: { MaThePhat: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy loại thẻ phạt!' });
        }
        res.json({ message: 'Xóa loại thẻ phạt thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa loại thẻ phạt!', error });
    }
});

// Cập nhật loại thẻ phạt
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await ThePhat.update(req.body, {
            where: { MaThePhat: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy loại thẻ phạt để cập nhật!' });
        }

        const updatedThePhat = await ThePhat.findOne({ where: { MaThePhat: id } });
        res.json({ message: 'Cập nhật loại thẻ phạt thành công!', data: updatedThePhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật loại thẻ phạt!', error });
    }
});

module.exports = router;
