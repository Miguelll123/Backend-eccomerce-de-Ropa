
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastname: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    token: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;