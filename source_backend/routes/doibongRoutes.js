const express = require('express');
const { getDoiBong, createDoiBong, deleteDoiBong, updateDoiBong } = require('../controllers/DoiBongController');
const router = express.Router();

router.get('/', getDoiBong);
router.post('/', createDoiBong);
router.delete('/:MaDoiBong', deleteDoiBong);
router.put('/:MaCauThu', updateDoiBong);

module.exports = router;