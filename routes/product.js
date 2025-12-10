
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { upload } = require("../config/multer");
const {authentication} = require ("../middleware/authentication.js");

router.post("/",upload.array("images",2),ProductController.create);
router.get("/id/:id",ProductController.getProductByid);
router.get("/",ProductController.getALL);
router.get("/name/:name",ProductController.getProductsByName);
router.get("/category",ProductController.getByCategory);



module.exports = router;




