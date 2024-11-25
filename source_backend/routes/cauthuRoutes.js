const express = require('express');
const { getCauthus, createCauthu, deleteCauthu } = require('../controllers/cauthuController');
const router = express.Router();

router.get('/', getCauthus);
router.post('/', createCauthu);
router.delete('/:MaCauThu', deleteCauthu);

module.exports = router;