const express = require('express');
const SanThiDauController = require('../controllers/santhidauController');

const router = express.Router();

router.get('/', SanThiDauController.getAll);
router.get('/:id', SanThiDauController.getById);
router.post('/', SanThiDauController.create);
router.put('/:id', SanThiDauController.update);
router.delete('/:id', SanThiDauController.delete);

module.exports = router;
