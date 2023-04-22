const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop.js');
const authenticate = require('../middleware/authenticate');


router.get('/',shopController.getAddProductPage);
router.post('/',authenticate.authenticate,shopController.addProducts);

module.exports = router;