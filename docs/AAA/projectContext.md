# 📌 Contexto Técnico — E-commerce Monolítico (TypeScript + Sequelize + MySQL)

## 🏗️ Arquitectura General

- **Servidor**: VPS único (ej. Hostinger), sin Docker.
- **Stack**: Node.js (LTS) + TypeScript + Express + Sequelize (MySQL).
- **Frontend**: EJS + Bootstrap.
- **Backoffice**: `/admin`, requiere login con JWT.
- **Seguridad**: HTTPS con Nginx + Let's Encrypt + JWT para autenticación.
- **Migración**: Sequelize CLI.

## 📂 Estructura del Proyecto

### Código

```
/src
  /controllers
    homeController.ts
    cartController.ts
    productController.ts
    categoriesProductsController.ts
    adminLoginController.ts
    adminHomeController.ts
    adminProductsController.ts
    adminCategoriesController.ts
    adminOrdersController.ts
    adminSettingController.ts
  /logic
    adminLogic.ts
    adminCategoryLogic.ts
    adminProductLogic.ts
    adminOrderLogic.ts
    adminSettingsLogic.ts
  /models
    product.ts
    category.ts
    categoryImage.ts
    productImage.ts
    order.ts
    orderProduct.ts
    user.ts
    setting.ts
  /routes
    homeRoutes.ts
    productRoutes.ts
    searchRoutes.ts
    cartRoutes.ts
    checkoutRoutes.ts
    adminLoginRoutes.ts
    adminHomeRoutes.ts
    adminProductsRoutes.ts
    adminCategoriesRoutes.ts
    adminOrdersRoutes.ts
    adminSettingRoutes.ts
  /middleware
    loadSettings.ts
    logMiddleware.ts
  /views
    partials
    productionViews
    admin
  /config
    db.ts
    index.ts
  app.ts
  index.ts
```

### 🗄️ Modelos Sequelize (TypeScript)

#### Product

**Campos:**

- `id`: `number` (PK)
- `name`: `string`
- `price`: `decimal(10,2)`
- `description?`: `string`
- `categoryId`: `number` (FK)
- `showToClients`: `boolean` → controla visibilidad en catálogo y buscador
- `outStock`: `boolean` → si `true`, se muestra como "Fuera de stock"
- `deleted`: `boolean` → soft delete
- `order?`: `number` → orden de visualización
- `createdAt`/`updatedAt`: `Date`

**Relaciones:**
- `Product.belongsTo(Category)`
- `Product.hasMany(ProductImage)`

#### Category

**Campos:**

- `id`: `number` (PK)
- `name`: `string` (único)
- `description?`: `string`
- `deleted?`: `boolean` → soft delete
- `showToClients?`: `boolean` → visibilidad
- `createdAt`/`updatedAt`: `Date`

**Relaciones:**
- `Category.hasMany(CategoryImage)`

#### Order

**Campos:**

- `id`: `number` (PK)
- `total`: `decimal(10,2)`
- `products`: `string` → JSON con detalles de productos
- `address`: `string`
- `clientName`: `string`
- `clientNotes`: `string`
- `clientPhone`: `string`
- `status`: `ENUM('Nuevo', 'Procesando', 'Pagado', 'Enviado', 'Cancelado')`
- `createdAt`/`updatedAt`: `Date`

**Relaciones:**
- `Order.hasMany(OrderProduct)`

#### OrderProduct

**Campos:**

- `id`: `number` (PK)
- `productId`: `number` (FK)
- `orderId`: `number` (FK)

#### User

Modelo para usuarios del sistema (autenticación admin).

#### Setting

Modelo para configuración del sistema (temas, configuraciones admin).

## 🌐 Endpoints

### Públicos (API + Views)

#### API Routes

- `GET /api/products` → lista productos visibles (`showToClients=true && deleted=false`).
- `GET /api/products/:id` → detalle producto.
- `GET /api/search?q=texto` → buscador (filtra por `name`/`description`).
- `POST /api/cart/add/:id` → añadir producto al carrito (session-based).
- `GET /api/cart` → obtener carrito.
- `POST /api/cart/remove/:id` → eliminar del carrito.
- `POST /api/cart/clear` → limpiar carrito.

#### Views Routes

- `GET /` → home.
- `GET /product` → listado productos.
- `GET /product/:id` → detalle producto.
- `GET /cart` → carrito.
- `GET /checkout` → checkout.
- `POST /checkout` → procesar pedido.
- `GET /search?q=texto` → resultados búsqueda.

### Admin (JWT Authentication)

**Requiere login en `/admin/login` → obtiene JWT token.**

- `GET /admin` → home admin.
- `GET /admin/products` → lista productos (admin).
- `POST /admin/products` → crear producto.
- `PUT /admin/products/:id` → editar producto.
- `DELETE /admin/products/:id` → eliminar producto.
- `GET /admin/categories` → lista categorías.
- `POST /admin/categories` → crear categoría.
- `PUT /admin/categories/:id` → editar categoría.
- `DELETE /admin/categories/:id` → eliminar categoría.
- `GET /admin/orders` → listar pedidos.
- `PUT /admin/orders/:id` → actualizar estado pedido.
- `POST /admin/settings` → guardar configuración.

## 🛒 Flujos de compra

### 1. Ver productos

- `/product` → lista productos visibles.
- `/product/:id` → detalle con imagen (base64 o ruta).

### 2. Añadir al carrito

- **API**: `POST /api/cart/add/:id` → añade a session `cart`.
- **View**: Botón en producto → añade al carrito → redirige a `/cart`.

### 3. Carrito

- `GET /cart` → muestra productos del session.
- Botones: eliminar, editar cantidad.

### 4. Checkout

- `GET /checkout` → formulario de datos de envío.
- `POST /checkout` → crea `Order` + `OrderProduct` → redirige a `checkoutSuccess`.

### 5. Confirmación

- `GET /checkoutSuccess/:id` → muestra pedido creado.

## 📜 Scripts recomendados

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "npx sequelize-cli db:migrate",
    "seed": "npx sequelize-cli db:seed:all",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

## 🔐 Autenticación

- **Admin**: JWT token después de login en `/admin/login`.
- **Session**: para carrito de compras (`express-session`).
- **Token**: almacenado en `req.session.jwt` después de login.

## 📦 Archivos adicionales

- `.env.example` → variables de entorno (DB, PORT, SECRET).
- `public/` → assets estáticos (CSS, JS, imágenes).
- `uploads/` → imágenes subidas (productos, categorías).
- `migrations/` → scripts de migración Sequelize.
- `seeders/` → seeders para datos iniciales.
