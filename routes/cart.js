const shopController = require('../controllers/shop')

const express = require('express');
const router = express.Router();

router.get('/',shopController.getCart);
router.post('/',shopController.addCart);
router.delete('/delete/:id',shopController.deleteCart)

module.exports = router;