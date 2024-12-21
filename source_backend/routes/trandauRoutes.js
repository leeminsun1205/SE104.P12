const express = require('express');
const TranDauController = require('../controllers/trandauController');

const router = express.Router();

router.get('/', TranDauController.getAll);
router.get('/:id', TranDauController.getById);
router.post('/', TranDauController.create);
router.put('/:id', TranDauController.update);
router.delete('/:id', TranDauController.delete);

module.exports = router;
