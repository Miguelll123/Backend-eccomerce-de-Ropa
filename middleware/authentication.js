const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/Keys');

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authentication || req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token de autenticación'
            });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ 
            _id: payload.id,
            token: { $in: [token] }
        });
        
        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'No estás autorizado'
            });
        }
        
        req.user = user;
        next();
    } catch(error) {
        console.error('Error en autenticación:', error);
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido o expirado'
        });
    }
};

module.exports = { authentication };