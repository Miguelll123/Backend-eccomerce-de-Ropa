
const express = require('express');
const {authentication}= require('../middleware/authentication');

const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/',UserController.register);
router.post('/login',UserController.login);

module.exports = router;