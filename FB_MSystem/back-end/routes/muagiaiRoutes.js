const express = require('express');
const MuaGiaiController = require('../controllers/muagiaiController');

const router = express.Router();

router.get('/', MuaGiaiController.getAll); // Lấy danh sách tất cả mùa giải
router.get('/:id', MuaGiaiController.getById); // Lấy mùa giải theo ID
router.post('/', MuaGiaiController.create); // Thêm mùa giải mới
router.put('/:id', MuaGiaiController.update); // Cập nhật mùa giải
router.delete('/:id', MuaGiaiController.delete); // Xóa mùa giải

module.exports = router;
