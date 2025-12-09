
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { upload } = require("../config/multer");


router.post("/",upload.array("images",2),ProductController.create);
router.get("/id/:id",ProductController.getProductByid);



module.exports = router;




