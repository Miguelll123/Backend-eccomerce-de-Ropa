require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const { dbConnection } = require('./config/config');

// Middleware to parse JSON bodies con manejo de errores
app.use(express.json({
  limit: '10mb'
}));

// Middleware para manejar errores de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      ok: false,
      msg: 'Error en el formato JSON. Por favor verifica la sintaxis.',
      error: err.message
    });
  }
  next();
});

// Middleware para debug (temporal)
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body recibido:', JSON.stringify(req.body, null, 2));
  }
  next();
});

dbConnection();


app.use('/users', require('./routes/user'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});