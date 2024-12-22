const express = require('express');
const tranDauController = require('../controllers/tranDauController');

const router = express.Router();

router.get('/', tranDauController.getAll);
router.get('/:id', tranDauController.getById);
router.post('/', tranDauController.create);
router.put('/:id', tranDauController.update);
router.delete('/:id', tranDauController.delete);

module.exports = router;
