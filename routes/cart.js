const shopController = require('../controllers/shop')

const express = require('express');
const router = express.Router();

router.get('/',shopController.getCart);
router.post('/',shopController.addCart);

module.exports = router;