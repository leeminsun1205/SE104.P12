const express = require('express');
const { getSanThiDau, createSanThiDau, deleteSanThiDau } = require('../controllers/SanThiDauController');
const router = express.Router();

router.get('/', getSanThiDau);
router.post('/', createSanThiDau);
router.delete('/:MaDoiBong', deleteSanThiDau);

module.exports = router;