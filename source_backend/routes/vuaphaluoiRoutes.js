const express = require('express');
const router = express.Router();
const {
    getVuaPhaLuoi,
    createVuaPhaLuoi,
    deleteVuaPhaLuoi,
    updateVuaPhaLuoi,
} = require('../controllers/vuaphaluoiController');

// Lấy danh sách vua phá lưới
router.get('/', getVuaPhaLuoi);

// Thêm mới vua phá lưới
router.post('/', createVuaPhaLuoi);

// Xóa vua phá lưới theo mã cầu thủ và mã mùa giải
router.delete('/:MaCauThu/:MaMuaGiai', deleteVuaPhaLuoi);

// Cập nhật vua phá lưới theo mã cầu thủ và mã mùa giải
router.put('/:MaCauThu/:MaMuaGiai', updateVuaPhaLuoi);

module.exports = router;
