// routes/dsthephat.js
const express = require('express');
const router = express.Router();
const ThePhat = require('../models/DSThePhat');

// Lấy tất cả DS thẻ phạt
router.get('/', async (req, res) => {
    try {
        const thephats = await ThePhat.findAll();
        res.json(thephats);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách DS thẻ phạt!', error });
    }
});

// Thêm DS thẻ phạt mới
router.post('/', async (req, res) => {
    try {
        const thePhat = await ThePhat.create(req.body);
        res.status(201).json({ message: 'Thêm DS thẻ phạt thành công!', data: thePhat });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm DS thẻ phạt!', error });
    }
});

// Xóa DS thẻ phạt
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ThePhat.destroy({ where: { MaThePhat: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy DS thẻ phạt!' });
        }
        res.json({ message: 'Xóa DS thẻ phạt thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa DS thẻ phạt!', error });
    }
});

// Cập nhật DS thẻ phạt
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await ThePhat.update(req.body, {
            where: { MaThePhat: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy DS thẻ phạt để cập nhật!' });
        }

        const updatedThePhat = await ThePhat.findOne({ where: { MaThePhat: id } });
        res.json({ message: 'Cập nhật DS thẻ phạt thành công!', data: updatedThePhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật DS thẻ phạt!', error });
    }
});

module.exports = router;
