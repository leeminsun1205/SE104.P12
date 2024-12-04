const express = require('express');
const { getSanthidau, createSanthidau, deleteSanthidau } = require('../controllers/santhidauController');
const router = express.Router();

router.get('/', getSanthidau);
router.post('/', createSanthidau);
router.delete('/:MaDoiBong', deleteSanthidau);

module.exports = router;