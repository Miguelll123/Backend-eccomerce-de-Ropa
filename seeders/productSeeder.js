
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/Keys');
const Product = require('../models/Product');
const Category = require('../models/Category');

const img = (seed) => `https://picsum.photos/seed/${seed}/600/800`;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const cat = {
      camisetas: await Category.findOne({ name: 'Camisetas' }),
      pantalones: await Category.findOne({ name: 'Pantalones' }),
      zapatos: await Category.findOne({ name: 'Zapatos' }),
      accesorios: await Category.findOne({ name: 'Accesorios' }),
    };
    if (Object.values(cat).some(c => !c)) {
      console.log('Ejecuta primero seed:categories');
      process.exit(1);
    }
    
    // Si quieres usar tus propios nombres/URLs locales, reemplaza este helper.
    const sampleImages = (seedBase) => [
      img(`${seedBase}-1`),
      img(`${seedBase}-2`),
      img(`${seedBase}-3`),
    ];

    const products = [
      {
        name: 'Camiseta Básica Negra',
        description: 'Algodón 100%',
        price: 19.99,
        category: cat.camisetas._id,
        sizes: ['S','M','L','XL'],
        colors: ['Negro','Blanco'],
        images: sampleImages('camiseta1'),
        stock: 50,
        brand: 'Genérica',
        isActive: true,
      },
      {
        name: 'Jeans Clásicos',
        description: 'Corte recto',
        price: 49.99,
        category: cat.pantalones._id,
        sizes: ['28','30','32','34'],
        colors: ['Azul','Negro'],
        images: sampleImages('jeans1'),
        stock: 30,
        brand: 'DenimCo',
        isActive: true,
      },
      {
        name: 'Zapatillas Urbanas',
        description: 'Suela cómoda',
        price: 59.99,
        category: cat.zapatos._id,
        sizes: ['40','41','42','43'],
        colors: ['Blanco','Gris'],
        images: sampleImages('zapatos1'),
        stock: 25,
        brand: 'Street',
        isActive: true,
      },
      {
        name: 'Gorra Snapback',
        description: 'Ajustable',
        price: 14.99,
        category: cat.accesorios._id,
        sizes: ['U'],
        colors: ['Negro','Rojo'],
        images: sampleImages('gorra1'),
        stock: 40,
        brand: 'CapCo',
        isActive: true,
      },
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Productos creados');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

