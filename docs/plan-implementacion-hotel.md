estado actual del proyecto:
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



# Reglas para Qwen Code Companion

1. **Contexto del proyecto**
   - Proyecto monolítico en Node.js LTS + TypeScript + Express + Sequelize (MySQL).
   - Frontend: EJS + Bootstrap.
   - Backoffice: `/admin` con JWT.
   - Seguridad: HTTPS con Nginx + Let's Encrypt.
   - Migraciones con Sequelize CLI.

2. **Estilo de respuestas**
   - Siempre devolver ejemplos de código en **TypeScript**, no en JavaScript.
   - Usar sintaxis moderna y tipada (interfaces, types).
   - Incluir imports correctos y rutas relativas según la estructura `/src`.
   - Evitar pseudocódigo: entregar snippets listos para compilar.

3. **ORM y DB**
   - Usar **Sequelize** como ORM.
   - Respetar los modelos definidos (`Product`, `Category`, `Order`, etc.).
   - Incluir asociaciones (`belongsTo`, `hasMany`) cuando corresponda.

4. **Buenas prácticas**
   - Validar entradas en controladores.
   - Manejar errores con `try/catch` y `next(err)`.
   - No usar `any` salvo que sea estrictamente necesario.
   - Mantener separación clara entre `controllers`, `logic` y `models`.

5. **Respuestas esperadas**
   - Si se pide un flujo completo, devolver **plantillas completas** (ej. checkout, login).
   - Si se pide refactor, mostrar **antes y después**.
   - Si se pide explicación, ser breve y técnico, sin adornos innecesarios.

7. **Modificación mínima**
   - No modificar código existente salvo que:
     a) El usuario lo pida explícitamente.
     b) Sea necesario para corregir un error de compilación/ejecución.
     c) Sea imprescindible para implementar la funcionalidad solicitada.
   - Si la solución puede lograrse con cambios en un solo archivo, no proponer refactor global.

8. **Respeto a la estructura**
   - Mantener la arquitectura actual (controllers, logic, models, routes).
   - No mover funciones entre capas salvo que el usuario lo indique.
   - No cambiar nombres de variables, funciones o archivos existentes sin instrucción explícita.

9. **Confirmación antes de cambios grandes**
   - Si la solución implica modificar más de un archivo, primero listar los cambios propuestos y esperar confirmación.
   - No aplicar refactor masivo ni sugerir migraciones de stack.

10. **Comentarios en el código**
   - Cuando se sugiera un cambio, incluir comentarios `// Qwen suggestion` para marcar qué fue modificado.
   - No eliminar código existente sin reemplazo claro.

11. **Compatibilidad**
   - Mantener compatibilidad con TypeScript estricto (`tsconfig.json`).
   - No introducir dependencias nuevas sin confirmación.
   - Usar siempre las librerías ya presentes en el proyecto (Express, Sequelize, Bootstrap, etc.).





# Plan de implementación: migración e-commerce → hotel

## 1. Objetivo
Implementar el módulo hotel sobre la arquitectura actual del proyecto (Express + EJS + Sequelize + PostgreSQL) de forma incremental, sin romper el flujo existente de e-commerce.

## 2. Explicación simple del cambio
Piensen en esto como cambiar una tienda de ropa por un hotel, pero sin tirar todo lo que ya existe.

- Hoy el sistema vende productos. En el hotel no se venderán productos, sino habitaciones y reservas.
- Un producto viejo se convierte en un tipo de habitación. Por ejemplo: "Habitación Deluxe".
- Una foto de producto se convierte en una foto de ese tipo de habitación.
- Ahora necesitamos una habitación real, con número, estado y si está ocupada o no.
- Un pedido viejo se convierte en una reserva: alguien entra, se queda unos días y luego sale.
- El administrador debe poder ver todo esto en una pantalla nueva.

### 2.1 Qué cambia de forma muy simple
- Antes: había productos para vender.
- Ahora: hay tipos de habitaciones, habitaciones reales y reservas.
- Antes: un pedido tenía productos y dirección.
- Ahora: una reserva tiene habitación, fecha de entrada y fecha de salida.
- Antes: el stock indicaba si había producto.
- Ahora: el estado de la habitación indica si está libre, ocupada, limpia, etc.

### 2.2 Qué no hay que romper
- No hay que borrar lo que ya funciona.
- No hay que cambiar todo de golpe.
- Lo mejor es agregar nuevas tablas, nuevos modelos y nuevas pantallas, y dejar el resto funcionando.

## 3. Cambios concretos que hay que hacer

### 3.1 Cambiar la idea de "producto" por "tipo de habitación"
Esto es el cambio más importante.

Hoy el sistema tiene algo parecido a esto:
- un producto tiene nombre
- tiene precio
- tiene foto
- puede estar visible o no
- puede estar fuera de stock

En el hotel, eso debe convertirse en algo más parecido a esto:
- un tipo de habitación tiene nombre
- tiene descripción
- tiene precio de reserva
- tiene foto ilustrativa
- puede estar activo o inactivo

En palabras muy simples: un producto es una cosa para vender; un tipo de habitación es una categoría de lo que ofrece el hotel.

Cambios concretos:
- Quitar columnas viejas como `outStock` y `topProduct`.
- Agregar una columna nueva llamada `signPrice`.
- Esta columna representa cuánto cuesta reservar esa categoría de habitación.
- Si vale `0`, significa que esa categoría no tiene costo de reserva.

### 3.2 Cambiar las fotos de productos por fotos de tipos de habitación
Hoy las imágenes están asociadas a productos.

Ahora deben estar asociadas a tipos de habitación.

Esto significa:
- renombrar la idea de producto a tipo de habitación
- cambiar la relación para que una imagen pertenezca a una categoría de habitación
- mantener la lógica de subir fotos, mostrar fotos y borrarlas

### 3.3 Crear la habitación real
Aquí aparece algo nuevo: no basta con tener un tipo de habitación; también hace falta la habitación física.

Ejemplo:
- "Habitación Deluxe" es el tipo.
- La habitación 101 es una habitación concreta del hotel.

Por eso se necesita una entidad nueva llamada `Suit`.

Campos que debe tener:
- número de habitación
- estado actual
- si está activa o eliminada
- a qué tipo de habitación pertenece

Estados posibles:
- disponible
- no disponible
- en mantenimiento
- en limpieza
- ocupada

Esto se parece a decir: "la habitación 101 existe de verdad".

### 3.4 Cambiar los pedidos por reservas
El sistema actual tiene órdenes.

Una orden vieja se usa para vender productos, pero en el hotel lo que se necesita es una reserva.

Por eso se debe transformar la entidad `Order` en `Booking`.

La reserva debe guardar:
- qué habitación se reservó
- desde qué fecha
- hasta qué fecha
- cuánto cuesta la reserva
- si hubo recargo
- cuánto pagó el cliente en total
- el estado de la reserva

En otras palabras: antes se vendía un producto y se entregaba; ahora se reserva una habitación y se ocupa por un tiempo.

### 3.5 Crear nuevas pantallas de administración
El backoffice actual está pensado para vender cosas.

Ahora hay que agregar nuevas secciones para manejar el hotel:
- Suites: para ver y cambiar las habitaciones
- Bookings: para ver y gestionar reservas

El administrador debe poder entrar a estas pantallas desde el home del panel.

## 4. Qué se debe tocar en el proyecto

### 4.1 Base de datos
Hay que crear nuevas tablas:
- `suit_categories`
- `suit_category_images`
- `suits`
- `bookings`

También hay que modificar o reemplazar las tablas viejas que representaban productos y pedidos.

### 4.2 Modelos
Hay que crear nuevos modelos en [src/models](src/models) para cada entidad nueva.

Cada modelo debe tener:
- campos
- tipos de datos
- validaciones básicas
- relaciones con otros modelos

### 4.3 Controladores y rutas
Hay que crear o adaptar controladores para:
- crear categorías
- editar categorías
- listar categorías
- subir imágenes
- crear suites
- editar suites
- crear reservas
- cambiar estados de reserva

### 4.4 Vistas del admin
Hay que crear pantallas nuevas en [src/views/admin](src/views/admin) para:
- ver categorías
- crear o editar categorías
- ver suites
- ver reservas
- crear reservas

### 4.5 Estilos
Hay que agregar o adaptar CSS en [public/css/admin](public/css/admin) para que las nuevas pantallas se vean bien.

## 5. Reglas de negocio que no se pueden olvidar
Estas reglas son importantes porque hacen que el sistema sea útil de verdad.

- Una reserva no puede usar una habitación que ya está ocupada en esas fechas.
- Una suite debe tener un número único.
- Una suite debe mostrar un estado claro.
- Una reserva debe tener un estado como pendiente, confirmada, en curso o finalizada.
- El administrador debe poder cambiar estados desde una lista o un detalle.

## 6. Orden recomendado para hacerlo
1. Crear las tablas nuevas en base de datos.
2. Crear los modelos y relaciones.
3. Crear los endpoints del backend.
4. Hacer las pantallas del admin.
5. Conectar el menú del panel.
6. Probar con datos reales.

## 7. Versión ultra simple del plan
Si lo vemos como si fuera para un niño, sería así:

- Primero hacemos una caja para guardar tipos de habitaciones.
- Luego hacemos otra caja para guardar las habitaciones reales del hotel.
- Luego hacemos otra caja para guardar las reservas.
- Después enseñamos al administrador a usar esas cajas desde una pantalla.
- Finalmente comprobamos que todo funcione.

## 8. MVP mínimo para empezar
Si se quiere avanzar rápido, lo mínimo útil sería:
- crear tipos de habitación
- crear habitaciones reales
- crear reservas básicas con fechas
- ver todo desde el panel de administración

Con eso ya se puede probar el flujo completo del hotel.

---

## 9. Resumen final en una frase
El sistema pasa de vender cosas a administrar un hotel, y para eso hay que separar tres ideas claras: tipo de habitación, habitación real y reserva.
1. Crear nuevas entidades y tablas para hotel sin eliminar aún las actuales.
2. Implementar primero la base de datos y los modelos.
3. Exponer endpoints de administración para categorías, imágenes, suites y bookings.
4. Crear vistas del backoffice para gestión.
5. Añadir navegación en el home del admin.
6. Validar reglas de negocio y estados.

> Esta estrategia es la más segura para un desarrollo guiado por un modelo pequeño, porque divide el trabajo en bloques claros y evitables.

---

## 3. Cambios de dominio que deben hacerse

### 3.1 Product → SuitCategory
Se debe reemplazar el concepto de producto por una categoría de habitación.

Cambios de columnas:
- Quitar: `outStock`, `topProduct`
- Agregar: `signPrice` (number, decimal), que representa el costo de reserva de esa categoría. Si vale `0`, no hay costo de reserva.

Reglas de negocio:
- Una categoría debe tener nombre, descripción y precio de reserva.
- Debe poder activarse o desactivarse para mostrarla al administrador.
- Debe tener al menos una imagen ilustrativa.

### 3.2 ProductImage → SuitCategoryImage
Se debe renombrar el concepto y cambiar la relación para apuntar a una categoría de habitación.

Cambios:
- Renombrar la tabla física y el modelo.
- Cambiar la relación de `productId` a `suitCategoryId`.
- Mantener la lógica de subida de imágenes y almacenamiento.

### 3.3 Nueva entidad Suit
Representa la habitación física real.

Campos obligatorios:
- `id`
- `number` (número de habitación)
- `status` (`disponible`, `no disponible`, `en mantenimiento`, `en limpieza`, `ocupada`)
- `deleted` (soft delete)
- `suitCategoryId` (relación con la categoría)
- `createdAt`, `updatedAt`

Reglas de negocio:
- Una suite debe pertenecer a una categoría.
- El número debe ser único.
- Si hay una reserva activa, el estado debe reflejarlo.
- El admin debe poder cambiar el estado desde la vista de suites.

### 3.4 Order → Booking
Se debe transformar la entidad de compra en una entidad de reserva.

Campos obligatorios:
- `id`
- `suitId` (relación a la habitación reservada)
- `startDate`
- `endDate`
- `totalPrice`
- `surchargePrice` (opcional)
- `totalClientPayment`
- `status` (por ejemplo: `Pendiente`, `Confirmada`, `En curso`, `Finalizada`, `Cancelada`)
- `clientName`, `clientPhone`, `clientNotes` (si aplica)
- `createdAt`, `updatedAt`

Cambios de columnas:
- Quitar: `products`, `total`, `address`, `trackingNumber`
- Agregar: `suitId`, `startDate`, `endDate`, `totalPrice`, `surchargePrice`, `totalClientPayment`

Reglas de negocio:
- La reserva debe validar que la habitación esté disponible en el rango de fechas.
- El admin debe poder asignar o modificar la habitación desde la reserva.
- El estado de la reserva debe cambiarse desde un selector.

### 3.5 Backoffice
Agregar nuevas secciones en el panel administrativo:
- Suites
- Bookings
- Menú de navegación en el home del admin

---

## 4. User Stories

### US1 - Gestión de categorías de habitaciones
Como administrador del hotel, quiero crear, editar, listar y eliminar categorías de habitaciones para organizar el inventario de habitaciones y definir el costo de reserva de cada tipo.

Criterios de aceptación:
- El admin puede crear una categoría con nombre, descripción y `signPrice`.
- El sistema guarda los campos correspondientes en base de datos.
- El admin puede modificar la información de una categoría existente.
- El admin puede eliminar o desactivar una categoría sin borrar físicamente el registro.
- La categoría puede estar asociada a imágenes ilustrativas.

### US2 - Gestión de imágenes de categorías de habitaciones
Como administrador del hotel, quiero subir y administrar imágenes de cada categoría de habitación para mostrar una vista visual de los tipos de habitaciones disponibles.

Criterios de aceptación:
- El admin puede subir una o varias imágenes para una categoría.
- El sistema asocia cada imagen a una categoría de habitación.
- El admin puede eliminar una imagen sin afectar el resto de la categoría.
- La aplicación permite distinguir una imagen principal de las secundarias si se requiere.

### US3 - Gestión de habitaciones físicas (suites)
Como administrador del hotel, quiero administrar las habitaciones reales del establecimiento para controlar su número, estado y disponibilidad en tiempo real.

Criterios de aceptación:
- El admin puede crear una suite indicando número, categoría y estado inicial.
- El sistema permite cambiar el estado de una suite manualmente.
- El sistema evita que una suite con reserva activa sea marcada como disponible si corresponde.
- El admin puede desactivar una suite sin borrar el registro.
- La vista de suites muestra un resumen visual del estado y el número de habitación.

### US4 - Gestión de reservas (bookings)
Como administrador del hotel, quiero crear, listar, editar y cambiar el estado de reservas para administrar la ocupación del establecimiento y los pagos del cliente.

Criterios de aceptación:
- El admin puede crear una reserva seleccionando habitación, fecha de ingreso y fecha de egreso.
- El sistema valida que la habitación esté disponible en el rango seleccionado.
- La reserva guarda los montos de reserva, recargo y pago total del cliente.
- El admin puede modificar el estado de una reserva desde un selector.
- El sistema muestra las reservas en una tabla o listado con información relevante.

---

## 5. Tareas de implementación

### Fase 1: Base de datos y modelos
#### Tarea 1.1 - Crear migraciones
- Crear migración para `suit_categories`.
- Crear migración para `suit_category_images`.
- Crear migración para `suits`.
- Crear migración para `bookings`.
- Añadir índices básicos para `deleted`, `status`, `suitCategoryId`, `suitId` y fechas.

#### Tarea 1.2 - Crear modelos Sequelize
- Crear o adaptar modelos en [src/models](src/models).
- Definir interfaces de atributos y creación.
- Añadir asociaciones: `SuitCategory` → `SuitCategoryImage`, `SuitCategory` → `Suit`, `Suit` → `Booking`.

#### Tarea 1.3 - Ajustar configuración de base de datos
- Verificar que [src/config/db.ts](src/config/db.ts) siga funcionando con la nueva estructura.
- Asegurar que los modelos nuevos se carguen desde [src/models/index.ts](src/models/index.ts).

### Fase 2: Categorías de habitaciones
#### Tarea 2.1 - Backend de categorías
- Crear controlador para categorías de habitaciones.
- Crear rutas para listar, crear, editar y eliminar/desactivar categorías.
- Implementar validaciones para nombre, descripción y `signPrice`.

#### Tarea 2.2 - Vistas del admin
- Crear una vista para listar categorías.
- Crear una vista para crear/editar categoría.
- Añadir botones en el panel administrativo para entrar a esta sección.

### Fase 3: Imágenes de categorías
#### Tarea 3.1 - Subida de imágenes
- Reutilizar el patrón de subida de imágenes existente en el proyecto.
- Añadir soporte para asociar imágenes a una categoría de habitación.
- Guardar el path o nombre del archivo en la base de datos.

#### Tarea 3.2 - Gestión de imágenes
- Añadir endpoint para eliminar una imagen.
- Añadir soporte para mostrar imágenes en la vista de categoría.

### Fase 4: Suites
#### Tarea 4.1 - Backend de suites
- Crear controlador y rutas para suites.
- Implementar listados por estado y por categoría.
- Implementar creación y edición de suites.
- Implementar soft delete.

#### Tarea 4.2 - Reglas de negocio de suite
- Validar que el número sea único.
- Permitir cambiar el estado manualmente.
- Exponer la suite como disponible o no disponible según su estado.

#### Tarea 4.3 - Vista de suites
- Crear vista tipo grilla o tabla con resumen de estado.
- Añadir modal o detalle al hacer click en una suite.
- Mostrar el estado con colores o etiquetas.

### Fase 5: Bookings
#### Tarea 5.1 - Backend de reservas
- Crear controlador y rutas para bookings.
- Implementar listado, creación, edición y cambio de estado.
- Implementar validación de fechas.
- Implementar validación de disponibilidad de la habitación.

#### Tarea 5.2 - Cálculo de precios
- Definir cómo se calcula `totalPrice`.
- Definir cómo se calcula `surchargePrice`.
- Definir cómo se actualiza `totalClientPayment`.
- Asegurarse de que los valores se guarden como decimales.

#### Tarea 5.3 - Vista de bookings
- Crear tabla de reservas con columnas clave.
- Añadir botón de crear reserva.
- Añadir selector de estado por fila o en detalle.
- Añadir formulario de creación/edición con selección de habitación y fechas.

### Fase 6: Backoffice y navegación
#### Tarea 6.1 - Menú del admin
- Añadir botones nuevos en el home del backoffice: Suites y Bookings.
- Garantizar que el acceso sea visible para usuarios administradores.

#### Tarea 6.2 - Integración visual
- Reutilizar estilos existentes en [public/css/admin](public/css/admin).
- Mantener consistencia con el diseño actual del admin.

### Fase 7: Datos y validación
#### Tarea 7.1 - Seeders
- Crear datos base de categorías.
- Crear datos base de suites.
- Crear un usuario admin de prueba si aún no existe.

#### Tarea 7.2 - Verificación manual
- Crear una categoría.
- Subir una imagen.
- Crear una suite.
- Crear una reserva.
- Modificar el estado de la reserva.
- Revisar que la lista de suites refleje el cambio.

---

## 6. Orden recomendado de ejecución
1. Migraciones y modelos.
2. CRUD de categorías.
3. Gestión de imágenes.
4. CRUD de suites.
5. CRUD de bookings.
6. Navegación en el backoffice.
7. Validación de reglas de negocio.
8. Seeders y pruebas manuales.

---

## 7. Recomendación de implementación mínima viable (MVP)
Si se quiere lanzar una versión funcional rápida, conviene implementar primero:
- Categorías de habitaciones.
- Suites.
- Reservas básicas con fechas y estado.
- Vista simple del admin.

Esto permite validar el flujo de negocio completo sin sobrecompletar la primera iteración.
