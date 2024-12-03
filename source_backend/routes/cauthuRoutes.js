const express = require('express');
const router = express.Router();
const Cauthu = require('../models/Cauthu');

router.get('/', async (req, res) => {
    try {
        const cauthus = await Cauthu.findAll(); // Lấy tất cả cầu thủ từ cơ sở dữ liệu
        res.json(cauthus); // Trả về danh sách cầu thủ
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách cầu thủ!', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const cauThu = await Cauthu.create(req.body);
        res.status(201).json({ message: 'Thêm cầu thủ thành công!', data: cauThu });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm cầu thủ!', error });
    }
});

module.exports = router;

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Cauthu.destroy({ where: { MaCauThu: id } });
        if (result === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cầu thủ!' });
        }
        res.json({ message: 'Xóa cầu thủ thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa cầu thủ!', error });
    }
});

module.exports = router;

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Cauthu.update(req.body, {
            where: { MaCauThu: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cầu thủ để cập nhật!' });
        }

        const updatedCauthu = await Cauthu.findOne({ where: { MaCauThu: id } });
        res.json({ message: 'Cập nhật thành công!', data: updatedCauthu });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật cầu thủ!', error });
    }
});

module.exports = router;
