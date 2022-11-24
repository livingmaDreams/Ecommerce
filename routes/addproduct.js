const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop.js');

router.post('/',shopController.addProducts);

module.exports = router;