
const User = require("../models/User");
const {authentication} = require("./authentication");

const isAdmin = async (req,res,next)=> {
    
      const admins = ['admins','superadmin'];
      if(!admins.includes(req.user.role)){
        return res.status(403).send({ok:'false',msg:"No tienes permisos de administardor"});
      
      }
      next();
}




module.exports = {isAdmin, authentication}