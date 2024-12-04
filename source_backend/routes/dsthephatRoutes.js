const express = require('express');
const router = express.Router();
const {
    getDSThePhat,
    createDSThePhat,
    updateDSThePhat,
    deleteDSThePhat,
} = require('../controllers/dsthephatController');

// Lấy tất cả DS thẻ phạt
router.get('/', getDSThePhat);

// Thêm DS thẻ phạt mới
router.post('/', createDSThePhat);

// Cập nhật DS thẻ phạt
router.put('/:id', updateDSThePhat);

// Xóa DS thẻ phạt
router.delete('/:id', deleteDSThePhat);

module.exports = router;