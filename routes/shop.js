const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/',shopController.getDetails);
router.get('/:category',shopController.getProducts);

module.exports = router;