
const mongoose = require ("mongoose");
const {MONGO_URI}= require ("../config/Keys.js");
const Category = require ("../models/Category.js");

const categories = [
  { name: 'Camisetas', description: 'Camisetas de todo tipo', isActive: true },
  { name: 'Pantalones', description: 'Jeans y pantalones', isActive: true },
  { name: 'Zapatos', description: 'Calzado', isActive: true },
  { name: 'Accesorios', description: 'Gorras, mochilas, etc.', isActive: true },
];


(async ()=> {
    try {
      await mongoose.connect(MONGO_URI);
      await Category.deleteMany({});
      await Category.insertMany(categories);
      console.log('Categorías creadas');
     process.exit(0);
    } catch(error){
        console.error('Error al conectar con la base de datos:', error.message);
        process.exit(1);
    }
})();
