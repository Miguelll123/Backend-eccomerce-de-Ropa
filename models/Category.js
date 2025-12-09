const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
