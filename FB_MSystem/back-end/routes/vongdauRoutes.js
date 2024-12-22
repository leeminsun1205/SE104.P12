const express = require('express');
const VongDauController = require('../controllers/vongdauController');

const router = express.Router();

router.get('/', VongDauController.getAll); // Lấy danh sách tất cả vòng đấu
router.get('/:id', VongDauController.getById); // Lấy vòng đấu theo ID
router.post('/', VongDauController.create); // Thêm vòng đấu mới
router.put('/:id', VongDauController.update); // Cập nhật vòng đấu
router.delete('/:id', VongDauController.delete); // Xóa vòng đấu

module.exports = router;
