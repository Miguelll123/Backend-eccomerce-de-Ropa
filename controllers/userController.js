

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/Keys');

const UserController = {

 async register(req,res){
    try {
     const { firstname, lastname, email, password } = req.body;
     
     // Validar que todos los campos requeridos estén presentes
     if (!firstname || !lastname || !email || !password) {
       return res.status(400).json({
         ok: false,
         msg: 'Todos los campos son requeridos: firstname, lastname, email, password',
         received: { firstname: !!firstname, lastname: !!lastname, email: !!email, password: !!password }
       });
     }
     
     // Convertir password a string si es necesario
     const passwordString = String(password);
     
     if (passwordString.length === 0) {
       return res.status(400).json({
         ok: false,
         msg: 'La contraseña no puede estar vacía'
       });
     }
     
     const hashedPassword = await bcrypt.hash(passwordString, 10);
     const user = await User.create({
       firstname: String(firstname),
       lastname: String(lastname),
       email: String(email),
       password: hashedPassword
     });
     
     // No enviar el password hasheado en la respuesta
     const userResponse = user.toObject();
     delete userResponse.password;
     
     res.status(201).json({
      ok: true,
      msg: 'Usuario creado con exito',
      user: userResponse
     });
    } catch(error){
        console.error('Error en register:', error);
        res.status(500).json({
          ok: false,
          msg: 'Error al crear usuario',
          error: error.message
        });
    }
 },
    async login (req,res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          ok: false,
          msg: 'Email y contraseña son requeridos'
        });
      }
      
      // Convertir a string si es necesario
      const emailString = String(email);
      const passwordString = String(password);
      
      const user = await User.findOne({ email: emailString });
      
      if(!user) {
        return res.status(404).json({
          ok: false,
          msg: "Usuario no encontrado"
        });
      }
      
      const isMatch = await bcrypt.compare(passwordString, user.password);
      
      if(!isMatch){
        return res.status(400).json({
          ok: false,
          msg: "Contraseña incorrecta"
        });
      }
      
      const token = jwt.sign({id: user._id}, JWT_SECRET);
      
      if(user.token.length > 4) {
        user.token.shift();
      }
      user.token.push(token);
      await user.save();
      
      res.json({
        ok: true,
        msg: `Login exitoso ${user.firstname} ${user.lastname}`,
        token
      });
    } catch(error){
        console.error('Error en login:', error);
        res.status(500).json({
          ok: false,
          msg: 'Error al hacer login',
          error: error.message
        });
    }
 }




}



module.exports = UserController;