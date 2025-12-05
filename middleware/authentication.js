const User = require ('../models/User.js');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/Keys');

const authentication = async (req,res,next) => {
    try {
    const token = req.headers.authentication;
    const payload = jwt.verify(token,JWT_SECRET);
    const user = await User.findOne({id:payload._id,tokens:token});
    if(!user){
        return res.status(401).send({msg:'No estas autorizado'})
    }
    req.user = user;
    next();
   } catch(error){
    console.error(error);
   }
}


module.exports = authentication;