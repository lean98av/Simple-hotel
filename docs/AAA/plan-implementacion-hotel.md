# Plan de implementación: migración e-commerce → hotel

## 1. Objetivo
Implementar el módulo hotel sobre la arquitectura actual del proyecto (Express + EJS + Sequelize + PostgreSQL) de forma incremental, sin romper el flujo existente de e-commerce.

## 2. Estrategia recomendada
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
