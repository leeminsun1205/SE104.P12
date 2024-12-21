const express = require('express');
const DoiBongController = require('../controllers/doibongController');

const router = express.Router();

router.get('/', DoiBongController.getAll);
router.get('/:id', DoiBongController.getById);
router.post('/', DoiBongController.create);
router.put('/:id', DoiBongController.update);
router.delete('/:id', DoiBongController.delete);

module.exports = router;
