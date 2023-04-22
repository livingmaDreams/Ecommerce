const shopController = require('../controllers/shop')

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.get('/',authenticate.authenticate,shopController.getCart);
router.post('/',authenticate.authenticate,shopController.addCart);
router.delete('/delete/:id',authenticate.authenticate,shopController.deleteCartItem)

module.exports = router;