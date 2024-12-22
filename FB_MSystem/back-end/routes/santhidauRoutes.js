const express = require('express');
const sanThiDauController = require('../controllers/sanThiDauController');

const router = express.Router();

router.get('/', sanThiDauController.getAll);
router.get('/:id', sanThiDauController.getById);
router.post('/', sanThiDauController.create);
router.put('/:id', sanThiDauController.update);
router.delete('/:id', sanThiDauController.delete);

module.exports = router;
