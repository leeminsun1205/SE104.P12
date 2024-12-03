const express = require('express');
const { getDoibong, createDoibong, deleteDoibong } = require('../controllers/doibongController');
const router = express.Router();

router.get('/', getDoibong);
router.post('/', createDoibong);
router.delete('/:MaDoiBong', deleteDoibong);

module.exports = router;