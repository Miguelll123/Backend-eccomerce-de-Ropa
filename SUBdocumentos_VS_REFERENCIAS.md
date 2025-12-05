# 🔗 SUBDOCUMENTOS vs REFERENCIAS - ¿Cuándo usar cada uno?

## 🎯 RESUMEN RÁPIDO:

### **SUBDOCUMENTOS (Anidados):**
- Los datos viven **dentro** del documento padre
- No necesitas populate
- Los datos se guardan juntos

### **REFERENCIAS (Populate):**
- Los datos viven en **documentos separados**
- Necesitas populate para traerlos
- Los documentos están relacionados pero separados

---

## ✅ CUÁNDO USAR SUBDOCUMENTOS (Anidados):

### **1. Datos que SIEMPRE se usan juntos**
```javascript
// ✅ BUENO: Dirección de envío en Order
const OrderSchema = new mongoose.Schema({
    shippingAddress: {
        street: String,    // ← Subdocumento
        city: String,      // ← Siempre se usa con Order
        zipCode: String    // ← No existe sin Order
    }
});
```

**¿Por qué?** La dirección de envío solo existe en el contexto del pedido. No la consultas por separado.

---

### **2. Datos que NO cambian (inmutables)**
```javascript
// ✅ BUENO: Items del pedido (snapshot)
const OrderSchema = new mongoose.Schema({
    items: [{
        productName: String,  // ← Snapshot del nombre
        price: Number,        // ← Precio al momento de compra
        quantity: Number
    }]
});
```

**¿Por qué?** Si el precio del producto cambia después, el pedido debe mantener el precio original. Es un "snapshot" histórico.

---

### **3. Datos pequeños y pocos**
```javascript
// ✅ BUENO: Items del carrito
const CartSchema = new mongoose.Schema({
    items: [{
        productId: ObjectId,
        quantity: Number,
        size: String,
        color: String
    }]  // ← Pocos items, datos simples
});
```

**¿Por qué?** Un carrito tiene pocos items (típicamente < 20). No crece mucho.

---

### **4. Datos que NO necesitas consultar por separado**
```javascript
// ✅ BUENO: Configuración de usuario
const UserSchema = new mongoose.Schema({
    preferences: {
        theme: String,      // ← No consultas esto solo
        language: String,   // ← Siempre con el usuario
        notifications: Boolean
    }
});
```

---

## ❌ CUÁNDO NO USAR SUBDOCUMENTOS:

### **1. Datos que crecen mucho**
```javascript
// ❌ MALO: Historial de pedidos en User
const UserSchema = new mongoose.Schema({
    orders: [{  // ← Puede crecer a cientos/miles
        orderId: ObjectId,
        total: Number,
        date: Date
    }]
});
```

**Problema:** El documento User crecería infinitamente. MongoDB tiene límite de 16MB por documento.

**Solución:** Usa referencia separada
```javascript
// ✅ BIEN: Referencia separada
const OrderSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: 'User' }
});
```

---

### **2. Datos que necesitas consultar por separado**
```javascript
// ❌ MALO: Productos anidados en Order
const OrderSchema = new mongoose.Schema({
    items: [{
        product: {
            name: String,     // ← Quieres buscar productos
            price: Number,    // ← Quieres filtrar por precio
            category: String  // ← Quieres listar por categoría
        }
    }]
});
```

**Problema:** No puedes hacer queries eficientes sobre productos desde Order.

**Solución:** Usa referencia
```javascript
// ✅ BIEN: Referencia
const OrderSchema = new mongoose.Schema({
    items: [{
        product: { type: ObjectId, ref: 'Product' }
    }]
});
```

---

### **3. Datos que se comparten entre múltiples documentos**
```javascript
// ❌ MALO: Producto anidado en Order
const OrderSchema = new mongoose.Schema({
    items: [{
        product: {
            name: String,
            description: String,
            images: [String]
        }
    }]
});
```

**Problema:** Si el producto cambia, tendrías que actualizar todos los pedidos.

**Solución:** Usa referencia (pero guarda snapshot de precio)
```javascript
// ✅ BIEN: Referencia + snapshot
const OrderSchema = new mongoose.Schema({
    items: [{
        product: { type: ObjectId, ref: 'Product' },  // ← Referencia
        price: Number,  // ← Snapshot del precio
        productName: String  // ← Snapshot del nombre (opcional)
    }]
});
```

---

## 🎯 EJEMPLOS PRÁCTICOS PARA TU E-COMMERCE:

### **1. Order (Pedido)**

#### **Items del pedido:**
```javascript
// ✅ MEZCLA: Referencia + datos snapshot
const OrderSchema = new mongoose.Schema({
    items: [{
        product: { type: ObjectId, ref: 'Product' },  // ← Referencia
        quantity: Number,
        price: Number,        // ← Snapshot (precio al momento)
        productName: String,  // ← Snapshot (nombre al momento)
        size: String,
        color: String
    }]
});
```

**¿Por qué?**
- Referencia: Para poder hacer populate y ver datos actuales del producto
- Snapshot: Para mantener el precio/nombre histórico del pedido

---

#### **Dirección de envío:**
```javascript
// ✅ SUBDOCUMENTO: Siempre con el pedido
const OrderSchema = new mongoose.Schema({
    shippingAddress: {
        street: String,    // ← Subdocumento
        city: String,
        zipCode: String,
        country: String
    }
});
```

**¿Por qué?** La dirección solo existe en el contexto del pedido. No la consultas por separado.

---

### **2. Cart (Carrito)**

```javascript
// ✅ REFERENCIA: Productos pueden cambiar
const CartSchema = new mongoose.Schema({
    items: [{
        product: { type: ObjectId, ref: 'Product' },  // ← Referencia
        quantity: Number,
        size: String,
        color: String
    }]
});
```

**¿Por qué?** 
- El producto puede cambiar (precio, stock, nombre)
- Quieres mostrar datos actuales del producto
- El carrito es temporal, no necesitas snapshot

---

### **3. Product (Producto)**

```javascript
// ❌ NO anidar: Categoría se comparte
const ProductSchema = new mongoose.Schema({
    category: {
        name: String,  // ← MALO: Se repite en muchos productos
        description: String
    }
});

// ✅ REFERENCIA: Categoría compartida
const ProductSchema = new mongoose.Schema({
    category: { type: ObjectId, ref: 'Category' }  // ← BIEN
});
```

**¿Por qué?** La categoría se comparte entre muchos productos. Si cambias el nombre, quieres que se actualice en todos.

---

## 📊 TABLA COMPARATIVA:

| Característica | Subdocumento | Referencia |
|---------------|--------------|------------|
| **Datos siempre juntos** | ✅ Sí | ❌ No |
| **Datos que crecen mucho** | ❌ No | ✅ Sí |
| **Datos compartidos** | ❌ No | ✅ Sí |
| **Datos inmutables (snapshot)** | ✅ Sí | ❌ No |
| **Consultas por separado** | ❌ No | ✅ Sí |
| **Rendimiento (lectura)** | ✅ Más rápido | ⚠️ Necesita populate |
| **Tamaño del documento** | ⚠️ Puede crecer | ✅ Controlado |
| **Actualizaciones** | ⚠️ Más complejo | ✅ Más fácil |

---

## 🎯 REGLAS DE ORO:

### **Usa SUBDOCUMENTO si:**
1. ✅ Los datos **siempre** se usan juntos
2. ✅ Los datos **no crecen** mucho (< 100 items)
3. ✅ Los datos **no necesitas** consultarlos por separado
4. ✅ Los datos son **inmutables** (snapshot histórico)

### **Usa REFERENCIA si:**
1. ✅ Los datos **pueden crecer** mucho
2. ✅ Los datos **se comparten** entre documentos
3. ✅ Los datos **necesitas** consultarlos por separado
4. ✅ Los datos **cambian** y quieres que se actualicen

### **Usa MEZCLA si:**
1. ✅ Necesitas **referencia** para consultas
2. ✅ Pero también necesitas **snapshot** de algunos datos
3. ✅ Ejemplo: `product: ObjectId` (referencia) + `price: Number` (snapshot)

---

## 💡 EJEMPLO FINAL: Order con MEZCLA

```javascript
const OrderSchema = new mongoose.Schema({
    // REFERENCIA: Para consultas y populate
    user: { type: ObjectId, ref: 'User' },
    
    // MEZCLA: Referencia + snapshot
    items: [{
        product: { type: ObjectId, ref: 'Product' },  // ← Referencia
        quantity: Number,
        price: Number,        // ← Snapshot (precio al momento)
        productName: String,  // ← Snapshot (opcional, para mostrar sin populate)
        size: String,
        color: String
    }],
    
    // SUBDOCUMENTO: Siempre con el pedido
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String,
        country: String
    },
    
    total: Number,
    status: String
});
```

**¿Por qué esta estructura?**
- `user`: Referencia (puede tener muchos pedidos)
- `items.product`: Referencia (producto compartido) + snapshot (precio histórico)
- `shippingAddress`: Subdocumento (solo existe con este pedido)

---

## 🚀 CONCLUSIÓN:

**No hay una regla única.** Depende de:
- Cómo usas los datos
- Si crecen mucho
- Si los consultas por separado
- Si necesitas snapshot histórico

**Para tu e-commerce:**
- **Order.items.product**: Referencia + snapshot de precio
- **Order.shippingAddress**: Subdocumento
- **Cart.items.product**: Solo referencia (no necesitas snapshot)
- **Product.category**: Solo referencia (compartida)

