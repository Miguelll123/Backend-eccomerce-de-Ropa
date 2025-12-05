
const mongoose = require("mongoose");

const {MONGO_URI} = require("./Keys");

const dbConnection = async ()=> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Base de datos conectada con exito')
    } catch(error){
        console.error('Error al conectar con la base de datos:', error.message);
        throw new Error(`Error al inicializar la BD: ${error.message}`)
    }
}


module.exports = {
    dbConnection
}