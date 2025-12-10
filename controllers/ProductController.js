
// controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');

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
  },

  async getALL(req,res) {
    try {
    const products = await Product.find().select('images name price color')
    res.send(products)
    } catch(error) {
        console.error('Error al obtener todos los productos',error)
    }
  },
  async getProductsByName (req,res) {

   try {
    if(req.params.name.length>25){
        return res.send({msg:'El nombre es demasiado largo'});
    }
   const name = new RegExp(req.params.name,'i');
   const products = await Product.find({name}).select('images name price color');
   res.send(products);

   } catch(error) {
    console.error('Error al obetner los productos por el nombre',error);
   }

  },
  async getByCategory(req,res) {
    try {
    const {category,minPrice,maxPrice,color,name,size} = req.query;
    const filter = {isActive:true};

    if(category) filter.category=category;
    if(minPrice || maxPrice) filter.price={};
    if(minPrice) filter.price.$gte =Number(minPrice);
    if(maxPrice) filter.price.$lte = Number(maxPrice);
    if(color) filter.colors = color;
    if(name) filter.name = new RegExp(name, 'i');
    if(size) filter.sizes= size;

    const Produtcs = await Product.find(filter).select('images name price colors');
    res.send(Produtcs);
    } catch(error) {
        console.error('error al obtener los produtos por categoria',error)
    }
  }
};




module.exports = productController;