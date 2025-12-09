
// controllers/productController.js
const Product = require('../models/Product');

const productController = {
  async uploadImages(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
      }

      const files = req.files?.map(f => f.path) || [];
      if (!files.length) {
        return res.status(400).json({ ok: false, msg: 'No se subieron archivos' });
      }

      product.images.push(...files);
      await product.save();

      // Si sirves /uploads, las URLs accesibles serían / + path
      const urls = files.map(p => `/${p}`);

      res.json({ ok: true, msg: 'Imágenes subidas', images: urls, product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, msg: 'Error al subir imágenes', error: err.message });
    }
  },


  async create(req,res) {
    try {
    const files = req.files?.map(f => f.path) || [];
    const product = await Product.create({
        ...req.body,
        images: files
    })
    res.status(201).json({ ok:true, msg:'Mensaje craedo con exito',product});
    } catch(error) {
        console.error('Error en la creación del producto',error)
    }
  },

  async getProductByid(req,res) {
    try {
     const product = await Product.findById(req.params.id).select('-stock -brand -isActive -createdAt -updateAt')
     if(!product) {
        res.status(404).json({ok:false, mgh:'Producto no encontrado'});
     }
     res.send(product);

    } catch(error) {
        console.error('Error al obtener el producto por IdD', error)
    }
  }
};

module.exports = productController;