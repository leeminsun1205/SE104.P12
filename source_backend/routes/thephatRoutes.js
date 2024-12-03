// routes/thephat.js
const express = require('express');
const router = express.Router();
const ThePhat = require('../models/ThePhat');

// Lấy tất cả thẻ phạt
router.get('/', async (req, res) => {
    try {
        const thephats = await ThePhat.findAll();
        res.json(thephats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thẻ phạt!', error });
    }
});

// Thêm thẻ phạt mới
router.post('/', async (req, res) => {
    try {
        const thePhat = await ThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm thẻ phạt thành công!', data: thePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm thẻ phạt!', error });
    }
});

// Xóa thẻ phạt
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ThePhat.destroy({ where: { MaThePhat: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thẻ phạt!' });
        }
        res.json({ message: 'Xóa thẻ phạt thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa thẻ phạt!', error });
    }
});

// Cập nhật thẻ phạt
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await ThePhat.update(req.body, {
            where: { MaThePhat: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thẻ phạt để cập nhật!' });
        }

        const updatedThePhat = await ThePhat.findOne({ where: { MaThePhat: id } });
        res.json({ message: 'Cập nhật thẻ phạt thành công!', data: updatedThePhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thẻ phạt!', error });
    }
});

module.exports = router;
