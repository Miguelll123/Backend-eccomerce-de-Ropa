
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  colors: {
    type: [String],
    default: [],
  },
  brand: {
    type: String,
    default: 'Genérica',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
