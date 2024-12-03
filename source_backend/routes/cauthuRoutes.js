const express = require('express');
const { getCauthu, createCauthu, deleteCauthu } = require('../controllers/cauthuController');
const router = express.Router();

router.get('/', getCauthu);
router.post('/', createCauthu);
router.delete('/:MaCauThu', deleteCauthu);

module.exports = router;