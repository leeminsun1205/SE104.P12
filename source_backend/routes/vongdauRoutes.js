const express = require('express');
const { getVongdau, createVongdau, deleteVongdau } = require('../controllers/vongdauController');
const router = express.Router();

router.get('/', getVongdau);
router.post('/', createVongdau);
router.delete('/:MaCauThu', deleteVongdau);

module.exports = router;