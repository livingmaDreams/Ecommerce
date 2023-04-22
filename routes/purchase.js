const shopController = require('../controllers/shop');
const authenticate = require('../middleware/authenticate');


const express = require('express');
const router = express.Router();

router.post('/payment',authenticate.authenticate,shopController.addOrder);
router.get('/order-details',authenticate.authenticate,shopController.getOrder);
router.get('/',shopController.getOrderPage);
module.exports = router;