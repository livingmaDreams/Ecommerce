const shopController = require('../controllers/shop')

const express = require('express');
const router = express.Router();

router.post('/',shopController.addOrder);
router.get('/order-details',shopController.getOrder);

module.exports = router;