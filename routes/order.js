
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const {authentication} = require('../middleware/authentication');


router.post('/',authentication,OrderController.create);


module.exports = router;