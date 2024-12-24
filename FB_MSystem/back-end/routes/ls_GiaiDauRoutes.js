const express = require('express');
const lichSuGiaiDauController = require('../controllers/ls_GiaiDauController');

const router = express.Router();

router.get('/doi-bong/:MaDoiBong', lichSuGiaiDauController.getByDoiBong); // Lấy lịch sử giải đấu của đội bóng
router.post('/', lichSuGiaiDauController.create);
router.put('/:MaDoiBong', lichSuGiaiDauController.update);
router.delete('/:MaDoiBong', lichSuGiaiDauController.delete);

module.exports = router;
