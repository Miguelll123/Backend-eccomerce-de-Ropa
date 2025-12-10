
const Order = require("../models/Order");
const { authentication } = require("./authentication");


const isAuthor = async (req,resizeBy,next)=> {
    try {
   const order = await Order.findById(req.params._id)
    if(order.userId.toString()!== req.userId.toString()){
        return res.status(403).send({msg:"Este pedido no es tuyo"});
    }
   next()
    } catch(error) {
        console.error(error)
       return  res.status(500).send({error,msg:"Ha habido un problema con la auditoria del pediddo"})
    }
}


module.exports = {authentication,isAuthor}