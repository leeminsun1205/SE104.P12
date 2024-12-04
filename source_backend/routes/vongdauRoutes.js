const express = require('express');
const { getVongDau, createVongDau, deleteVongDau } = require('../controllers/VongDauController');
const router = express.Router();

router.get('/', getVongDau);
router.post('/', createVongDau);
router.delete('/:MaCauThu', deleteVongDau);

module.exports = router;