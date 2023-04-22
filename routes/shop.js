const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const authenticate = require('../middleware/authenticate');

//router.get('/',shopController.getDetails);
//router.get('/:category',shopController.getProducts);


router.get('/',shopController.getShopPage);
router.get('/products',authenticate.authenticate,shopController.getProducts);

module.exports = router;