
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {

       firstname: {
        type:String,
        required: [true, 'El nombre es oblogatorio']
       },
       lastname: {
        type:String,
        required:[true,'EL apellido es obligatorio']
       },
       email: {
        type:String,
        required: [true, 'El email es obligatorio']
       },
       password: {
        type:String,
        required: [true, 'La contraseña es obligatoria']
       },
       confirmed: {
            type: Boolean,
            default: false,
            },
            token: [],
            },
            {
                timestamps: true
                
            }
)



const User = mongoose.model('User', UserSchema);

module.exports = User;