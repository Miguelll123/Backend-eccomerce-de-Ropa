# 📋 PLAN DE TRABAJO - E-COMMERCE DE ROPA

## 🎯 OBJETIVO
Crear un backend completo para un e-commerce de ropa con carrito, pedidos, gestión de productos, imágenes, etc.

---

## 📦 FASE 1: PREPARACIÓN Y DEPENDENCIAS

### 1.1 Instalar dependencias necesarias
```bash
npm install multer cloudinary multer-storage-cloudinary
npm install express-validator
npm install --save-dev mongoose-seed
```

**Dependencias a instalar:**
- ✅ `multer` - Para subir archivos/imágenes
- ✅ `cloudinary` o `multer-storage-cloudinary` - Para almacenar imágenes (o usar carpeta local)
- ✅ `express-validator` - Para validar datos de entrada
- ✅ `mongoose-seed` o crear seeders manuales

---

## 🗂️ FASE 2: ESTRUCTURA DE MODELOS

### 2.1 Modelos a crear (en orden de prioridad):

#### **Product** (Producto)
```javascript
- name: String (requerido)
- description: String
- price: Number (requerido)
- category: String (requerido) // "camisetas", "pantalones", "zapatos", etc.
- size: [String] // ["S", "M", "L", "XL"]
- color: [String] // ["rojo", "azul", "negro"]
- images: [String] // URLs de las imágenes
- stock: Number (requerido)
- brand: String // marca
- isActive: Boolean (default: true)
- timestamps
```

#### **Category** (Categoría)
```javascript
- name: String (requerido, único)
- description: String
- image: String // URL de imagen de categoría
- isActive: Boolean (default: true)
- timestamps
```

#### **Cart** (Carrito)
```javascript
- user: ObjectId (ref: User, requerido)
- items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    size: String,
    color: String,
    price: Number // precio al momento de agregar
  }]
- total: Number (default: 0)
- timestamps
```

#### **Order** (Pedido)
```javascript
- user: ObjectId (ref: User, requerido)
- items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }]
- total: Number (requerido)
- status: String (enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending")
- shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
- paymentMethod: String
- paymentStatus: String (enum: ["pending", "paid", "failed"], default: "pending")
- timestamps
```

#### **Review** (Reseñas) - Opcional para después
```javascript
- user: ObjectId (ref: User)
- product: ObjectId (ref: Product)
- rating: Number (1-5)
- comment: String
- timestamps
```

---

## 🛠️ FASE 3: CONFIGURACIÓN

### 3.1 Configurar Multer
- Crear carpeta `uploads/` o `public/images/`
- Configurar multer en `config/multer.js`
- Definir límites de tamaño y tipos de archivo permitidos

### 3.2 Configurar Cloudinary (opcional)
- O usar almacenamiento local
- Configurar en `config/cloudinary.js`

### 3.3 Middleware de autenticación
- Verificar que el middleware de auth funcione correctamente
- Crear middleware para verificar roles (admin, user)

---

## 📝 FASE 4: RUTAS Y CONTROLADORES

### 4.1 Productos (Products)
**Rutas:**
- `GET /api/products` - Listar todos los productos (con filtros)
- `GET /api/products/:id` - Obtener un producto
- `POST /api/products` - Crear producto (solo admin)
- `PUT /api/products/:id` - Actualizar producto (solo admin)
- `DELETE /api/products/:id` - Eliminar producto (solo admin)
- `POST /api/products/:id/images` - Subir imágenes (solo admin)

**Controlador:** `controllers/productController.js`

### 4.2 Categorías (Categories)
**Rutas:**
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (solo admin)
- `PUT /api/categories/:id` - Actualizar categoría (solo admin)
- `DELETE /api/categories/:id` - Eliminar categoría (solo admin)

**Controlador:** `controllers/categoryController.js`

### 4.3 Carrito (Cart)
**Rutas:**
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update/:itemId` - Actualizar cantidad
- `DELETE /api/cart/remove/:itemId` - Eliminar item del carrito
- `DELETE /api/cart/clear` - Vaciar carrito

**Controlador:** `controllers/cartController.js`

### 4.4 Pedidos (Orders)
**Rutas:**
- `GET /api/orders` - Listar pedidos del usuario
- `GET /api/orders/:id` - Obtener un pedido
- `POST /api/orders` - Crear pedido desde el carrito
- `PUT /api/orders/:id` - Actualizar pedido (cambiar estado)
- `DELETE /api/orders/:id` - Cancelar pedido

**Controlador:** `controllers/orderController.js`

---

## 🌱 FASE 5: SEEDERS

### 5.1 Crear estructura de seeders
- Carpeta `seeders/`
- `seeders/productSeeder.js`
- `seeders/categorySeeder.js`
- `seeders/userSeeder.js` (crear usuarios de prueba, incluyendo admin)

### 5.2 Scripts en package.json
```json
"seed:products": "node seeders/productSeeder.js",
"seed:categories": "node seeders/categorySeeder.js",
"seed:all": "node seeders/runAllSeeders.js"
```

---

## 📋 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### **PASO 1: Modelos básicos** ⭐ EMPIEZA AQUÍ
1. ✅ Crear modelo `Category`
2. ✅ Crear modelo `Product`
3. ✅ Probar que se crean correctamente

### **PASO 2: CRUD de Categorías**
1. ✅ Crear `routes/category.js`
2. ✅ Crear `controllers/categoryController.js`
3. ✅ Probar todas las rutas

### **PASO 3: CRUD de Productos (sin imágenes aún)**
1. ✅ Crear `routes/product.js`
2. ✅ Crear `controllers/productController.js`
3. ✅ Probar crear, listar, actualizar productos

### **PASO 4: Configurar Multer**
1. ✅ Instalar multer
2. ✅ Crear `config/multer.js`
3. ✅ Crear carpeta `uploads/` o `public/images/`
4. ✅ Agregar ruta para subir imágenes

### **PASO 5: Carrito**
1. ✅ Crear modelo `Cart`
2. ✅ Crear `routes/cart.js`
3. ✅ Crear `controllers/cartController.js`
4. ✅ Implementar agregar, actualizar, eliminar items

### **PASO 6: Pedidos**
1. ✅ Crear modelo `Order`
2. ✅ Crear `routes/order.js`
3. ✅ Crear `controllers/orderController.js`
4. ✅ Implementar crear pedido desde carrito

### **PASO 7: Seeders**
1. ✅ Crear seeders para categorías
2. ✅ Crear seeders para productos
3. ✅ Probar que funcionen

### **PASO 8: Mejoras y validaciones**
1. ✅ Agregar validaciones con express-validator
2. ✅ Agregar filtros y búsqueda de productos
3. ✅ Agregar paginación
4. ✅ Mejorar manejo de errores

---

## 🎨 ESTRUCTURA FINAL DE CARPETAS

```
Eccomerce/
├── config/
│   ├── config.js
│   ├── Keys.js
│   ├── multer.js
│   └── cloudinary.js (opcional)
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── authentication.js
│   └── authorization.js (para roles)
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── user.js
│   ├── product.js
│   ├── category.js
│   ├── cart.js
│   └── order.js
├── seeders/
│   ├── categorySeeder.js
│   ├── productSeeder.js
│   └── runAllSeeders.js
├── uploads/ o public/images/
├── index.js
└── package.json
```

---

## 💡 CONSEJOS IMPORTANTES

1. **Empieza simple**: Primero haz que funcione sin imágenes, luego agrega multer
2. **Un paso a la vez**: No intentes hacer todo de golpe
3. **Prueba cada cosa**: Después de cada modelo/ruta, prueba que funcione
4. **Usa Postman/Insomnia**: Para probar todas las rutas
5. **Validaciones**: Siempre valida los datos que recibes
6. **Manejo de errores**: Siempre maneja los errores correctamente

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Instalar dependencias básicas** (multer, express-validator)
2. **Crear el modelo Category** (el más simple)
3. **Crear rutas y controlador de Category**
4. **Probar que funciona**
5. **Luego pasar al modelo Product**

¿Empezamos con el modelo Category?

