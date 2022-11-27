const shopController = require('../controllers/shop')

const express = require('express');
const router = express.Router();

router.post('/',shopController.addOrder);


module.exports = router;