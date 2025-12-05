# 🧠 GUÍA: CÓMO PENSAR EN MODELOS Y ENDPOINTS

## 📚 PARTE 1: ¿QUÉ CREAR COMO MODELO?

### 🤔 PREGUNTAS CLAVE PARA DECIDIR SI ALGO ES UN MODELO:

#### 1. **¿Es una "cosa" que tiene datos propios?**
   - ✅ **SÍ** → Probablemente es un modelo
   - ❌ **NO** → Probablemente es solo un campo

**Ejemplos:**
- ❓ "Usuario" → ¿Tiene datos propios? (nombre, email, password) → ✅ **SÍ, es modelo**
- ❓ "Precio" → ¿Tiene datos propios? (solo es un número) → ❌ **NO, es campo del Producto**
- ❓ "Dirección de envío" → ¿Tiene datos propios? (calle, ciudad, código postal) → 🤔 **DEPENDE**

#### 2. **¿Se relaciona con otras "cosas"?**
   - Si se relaciona con otros modelos → Probablemente es un modelo

**Ejemplos:**
- ❓ "Producto" → ¿Se relaciona con Usuario? (sí, el usuario compra productos) → ✅ **Es modelo**
- ❓ "Categoría" → ¿Se relaciona con Producto? (sí, un producto tiene categoría) → ✅ **Es modelo**
- ❓ "Color" → ¿Se relaciona con Producto? (sí, pero... ¿es solo un string o tiene más datos?) → 🤔 **DEPENDE**

#### 3. **¿Necesita ser consultada/guardada independientemente?**
   - Si necesitas buscar/guardar esta "cosa" por separado → Es modelo

**Ejemplos:**
- ❓ "Carrito" → ¿Necesito buscar el carrito de un usuario? → ✅ **SÍ, es modelo**
- ❓ "Item del carrito" → ¿Necesito buscar items individuales? → 🤔 **Puede ser subdocumento o modelo**

#### 4. **¿Tiene un ciclo de vida propio?**
   - Si tiene estados, cambios, historial → Probablemente es modelo

**Ejemplos:**
- ❓ "Pedido" → ¿Tiene estados? (pendiente, enviado, entregado) → ✅ **SÍ, es modelo**
- ❓ "Reseña" → ¿Se crea, se modifica, se elimina? → ✅ **SÍ, es modelo**

---

## 🎯 REGLAS PRÁCTICAS:

### ✅ **SÍ es modelo si:**
- Tiene múltiples campos relacionados
- Se relaciona con otros modelos (referencias)
- Necesitas hacer queries sobre él
- Tiene un ciclo de vida (estados, timestamps)
- Puede existir sin el "padre" (aunque sea lógicamente relacionado)

### ❌ **NO es modelo si:**
- Es solo un valor simple (string, number, boolean)
- Es parte inseparable de otro modelo
- No necesitas consultarlo por separado
- Es solo un campo calculado

---

## 📊 EJEMPLOS PRÁCTICOS PARA E-COMMERCE:

### ✅ **MODELOS NECESARIOS:**

#### **User (Usuario)**
- ✅ Tiene datos propios (nombre, email, password)
- ✅ Se relaciona con otros (tiene carrito, hace pedidos)
- ✅ Necesitas consultarlo (login, perfil)
- ✅ Tiene ciclo de vida (se registra, se autentica)

#### **Product (Producto)**
- ✅ Tiene datos propios (nombre, precio, descripción, imágenes)
- ✅ Se relaciona con otros (tiene categoría, está en carritos, está en pedidos)
- ✅ Necesitas consultarlo (listar, buscar, filtrar)
- ✅ Tiene ciclo de vida (se crea, se actualiza, se desactiva)

#### **Category (Categoría)**
- ✅ Tiene datos propios (nombre, descripción, imagen)
- ✅ Se relaciona con otros (productos pertenecen a categorías)
- ✅ Necesitas consultarla (filtrar productos por categoría)
- ✅ Puede existir sin productos

#### **Cart (Carrito)**
- ✅ Tiene datos propios (items, total)
- ✅ Se relaciona con otros (usuario, productos)
- ✅ Necesitas consultarlo (obtener carrito del usuario)
- ✅ Tiene ciclo de vida (se crea, se actualiza, se vacía)

#### **Order (Pedido)**
- ✅ Tiene datos propios (items, total, dirección, estado)
- ✅ Se relaciona con otros (usuario, productos)
- ✅ Necesitas consultarlo (historial de pedidos)
- ✅ Tiene ciclo de vida (pendiente → enviado → entregado)

### 🤔 **CASOS DUDOSOS:**

#### **Color / Talla**
- ❓ ¿Es solo un string? → ❌ **NO es modelo, es campo array**
- ❓ ¿Tiene más datos? (código hex, stock por color) → ✅ **SÍ es modelo**

**Decisión para e-commerce simple:** ❌ **NO es modelo**, es array de strings en Product

#### **Dirección de Envío**
- ❓ ¿Solo se usa en pedidos? → ❌ **Puede ser subdocumento en Order**
- ❓ ¿El usuario guarda múltiples direcciones? → ✅ **SÍ es modelo (Address)**

**Decisión para e-commerce simple:** ❌ **NO es modelo**, es subdocumento en Order

#### **Item del Carrito**
- ❓ ¿Solo existe dentro del carrito? → ❌ **Subdocumento en Cart**
- ❓ ¿Necesitas consultar items individuales? → ✅ **Modelo separado**

**Decisión:** ❌ **Subdocumento en Cart** (más simple)

---

## 🔌 PARTE 2: ¿QUÉ ENDPOINTS CREAR?

### 🤔 PREGUNTAS CLAVE PARA DECIDIR ENDPOINTS:

#### 1. **¿Qué acciones necesita hacer el usuario/frontend?**

Piensa en el **flujo del usuario**:

```
Usuario entra a la tienda
  ↓
Ve categorías → GET /categories
  ↓
Ve productos → GET /products (o GET /products?category=camisetas)
  ↓
Ve un producto → GET /products/:id
  ↓
Agrega al carrito → POST /cart/add
  ↓
Ve su carrito → GET /cart
  ↓
Hace pedido → POST /orders
  ↓
Ve sus pedidos → GET /orders
```

#### 2. **¿Qué operaciones CRUD necesitas?**

Para cada modelo, piensa:
- **C**reate → ¿Quién puede crear? (admin, usuario)
- **R**ead → ¿Quién puede leer? (público, usuario autenticado)
- **U**pdate → ¿Quién puede actualizar? (admin, el mismo usuario)
- **D**elete → ¿Quién puede eliminar? (admin, el mismo usuario)

#### 3. **¿Qué consultas/filtros necesitas?**

- Listar todos
- Buscar por ID
- Filtrar por categoría
- Buscar por nombre
- Ordenar por precio
- Paginar resultados

---

## 📋 ENDPOINTS POR MODELO:

### **CATEGORY (Categorías)**

#### ¿Qué necesita el frontend?
- Ver todas las categorías → `GET /categories`
- Ver una categoría → `GET /categories/:id`
- (Admin) Crear categoría → `POST /categories`
- (Admin) Actualizar → `PUT /categories/:id`
- (Admin) Eliminar → `DELETE /categories/:id`

**¿Por qué estos?**
- El usuario necesita ver categorías para navegar
- El admin necesita gestionarlas

---

### **PRODUCT (Productos)**

#### ¿Qué necesita el frontend?
- Ver todos los productos → `GET /products`
- Ver un producto → `GET /products/:id`
- **Filtrar por categoría** → `GET /products?category=camisetas` ⭐
- **Buscar productos** → `GET /products?search=camiseta` ⭐
- **Filtrar por precio** → `GET /products?minPrice=10&maxPrice=50` ⭐
- (Admin) Crear → `POST /products`
- (Admin) Actualizar → `PUT /products/:id`
- (Admin) Eliminar → `DELETE /products/:id`
- (Admin) Subir imágenes → `POST /products/:id/images`

**¿Por qué estos?**
- El usuario necesita buscar, filtrar, ver productos
- El admin necesita gestionarlos

**¿Por qué NO un endpoint separado para "productos por categoría"?**
- ❌ `GET /categories/:id/products` → Más complejo
- ✅ `GET /products?category=:id` → Más flexible (puedes combinar filtros)

---

### **CART (Carrito)**

#### ¿Qué necesita el frontend?
- Ver mi carrito → `GET /cart`
- Agregar producto → `POST /cart/add` o `POST /cart/items`
- Actualizar cantidad → `PUT /cart/items/:itemId`
- Eliminar item → `DELETE /cart/items/:itemId`
- Vaciar carrito → `DELETE /cart`

**¿Por qué estos?**
- El usuario necesita gestionar su carrito
- Cada acción es una operación diferente

---

### **ORDER (Pedidos)**

#### ¿Qué necesita el frontend?
- Ver mis pedidos → `GET /orders`
- Ver un pedido → `GET /orders/:id`
- Crear pedido → `POST /orders` (desde el carrito)
- Cancelar pedido → `PUT /orders/:id/cancel` o `PUT /orders/:id` (cambiar estado)
- (Admin) Ver todos los pedidos → `GET /admin/orders`
- (Admin) Actualizar estado → `PUT /admin/orders/:id/status`

**¿Por qué estos?**
- El usuario necesita ver y gestionar sus pedidos
- El admin necesita gestionar todos los pedidos

---

## 🎯 REGLAS PARA ENDPOINTS:

### ✅ **SÍ crear endpoint si:**
- Es una acción que el frontend necesita hacer
- Es una operación CRUD estándar
- Es una consulta común (filtrar, buscar)

### ❌ **NO crear endpoint separado si:**
- Puedes hacerlo con query parameters
- Es solo una variación de otro endpoint
- Es demasiado específico (mejor usar filtros)

---

## 🔍 EJEMPLOS DE DECISIONES:

### ❓ **¿Endpoint separado para "productos por categoría"?**

**Opción A:** `GET /categories/:id/products`
- ❌ Menos flexible
- ❌ No puedes combinar con otros filtros fácilmente

**Opción B:** `GET /products?category=:id`
- ✅ Más flexible
- ✅ Puedes combinar: `GET /products?category=camisetas&minPrice=20&maxPrice=50`
- ✅ Más RESTful

**Decisión:** ✅ **Opción B**

---

### ❓ **¿Endpoint para "productos más vendidos"?**

**Opción A:** `GET /products/popular`
- ✅ Útil si es una consulta común
- ✅ Más semántico

**Opción B:** `GET /products?sort=sales&limit=10`
- ✅ Más flexible
- ✅ Puedes ordenar por cualquier cosa

**Decisión:** Depende de tu caso. Si es muy común → Opción A. Si quieres flexibilidad → Opción B.

---

### ❓ **¿Endpoint para "agregar al carrito" vs "actualizar carrito"?**

**Opción A:** 
- `POST /cart/add` (agregar)
- `PUT /cart/update/:itemId` (actualizar)

**Opción B:**
- `POST /cart/items` (agregar o actualizar si existe)

**Decisión:** ✅ **Opción A** (más claro, separa responsabilidades)

---

## 📝 CHECKLIST PARA CADA MODELO:

Cuando crees un modelo, pregúntate:

1. ✅ ¿Qué datos necesita tener?
2. ✅ ¿Con qué otros modelos se relaciona?
3. ✅ ¿Quién puede crearlo? (público, usuario, admin)
4. ✅ ¿Quién puede leerlo? (público, usuario, admin)
5. ✅ ¿Quién puede actualizarlo?
6. ✅ ¿Quién puede eliminarlo?
7. ✅ ¿Qué consultas/filtros necesita?
8. ✅ ¿Necesita paginación?
9. ✅ ¿Necesita ordenamiento?

---

## 🎓 PROCESO DE DISEÑO RECOMENDADO:

### **PASO 1: Identificar Entidades**
- Lista todas las "cosas" de tu sistema
- Ejemplo: Usuario, Producto, Categoría, Carrito, Pedido

### **PASO 2: Decidir Modelos**
- Para cada entidad, pregunta: ¿Es modelo o campo?
- Usa las preguntas clave de arriba

### **PASO 3: Pensar en Relaciones**
- ¿Cómo se relacionan los modelos?
- Ejemplo: Usuario → tiene → Carrito → contiene → Productos

### **PASO 4: Pensar en Casos de Uso**
- ¿Qué necesita hacer el usuario?
- ¿Qué necesita hacer el admin?
- Escribe los flujos paso a paso

### **PASO 5: Crear Endpoints**
- Para cada caso de uso, crea el endpoint necesario
- Empieza con CRUD básico
- Agrega filtros y búsquedas después

### **PASO 6: Refinar**
- ¿Puedes combinar endpoints?
- ¿Hay endpoints redundantes?
- ¿Faltan endpoints importantes?

---

## 💡 CONSEJOS FINALES:

1. **Empieza simple**: CRUD básico primero, filtros después
2. **Piensa en el frontend**: ¿Qué necesita mostrar/hacer?
3. **Sé flexible**: Usa query parameters para filtros
4. **Sigue REST**: GET para leer, POST para crear, PUT para actualizar, DELETE para eliminar
5. **No sobre-ingeniería**: Si algo es simple, hazlo simple

---

## 🚀 PRÓXIMOS PASOS:

1. Revisa tu lista de modelos con estas preguntas
2. Piensa en los flujos de usuario
3. Diseña los endpoints básicos primero
4. Agrega filtros y búsquedas después
5. Prueba y refina

¿Tienes más dudas sobre algún modelo o endpoint específico?

