
const User = require('../models/User');
const Order = require('../models/Order');



const OrderController = {
async create(req,res){
    try {
const order = await Order.create({
    user: req.user._id,
    ...req.body,
    status:'pending',
    deliveryDate: new Date().setDate(new Date().getDate()+2)
});
res.status(201).send(order);

    } catch(error){
        console.error('Error en la creacion del pedido')
    }
}

}




module.exports = OrderController;