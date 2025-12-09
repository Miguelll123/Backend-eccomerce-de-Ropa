
const express = require('express');
const router = express.Router();
const {upload} = require('../config/multer');
const Product = require('../models/Product');
const ProductController = require('../controllers/ProductController');


router.post('/:id', upload.array('images', 5), ProductController.uploadImages);





module.exports = router;