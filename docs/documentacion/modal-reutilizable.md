# Modal Reutilizable

## Descripción

El modal reutilizable reemplaza el uso de `alert()` nativo de JavaScript por modales personalizados con Bootstrap. Proporciona una mejor experiencia de usuario con opciones para mostrar mensajes personalizados y modales de confirmación.

## Estructura de Archivos

```
src/
├── js/
│   └── modal.js              # Lógica del modal (funciones)
└── views/
    └── partials/
        └── modal.ejs          # Template del modal (HTML)
```

## Uso

### 1. Incluir el archivo JS en cada vista

```html
<script src="/js/modal.js"></script>
```

### 2. Incluir el modal HTML usando el partial

```html
<%- include('partials/globalModal') %>
```

### 3. Usar la función showModal()

```javascript
// Mostrar un modal con mensaje
showModal('Título', 'Mensaje', true);

// Mostrar un modal sin botón de cancelar
showModal('Confirmación', '¿Estás seguro?', false);
```

## Funciones disponibles

### showModal(title, message, showCancel)

Mostrar un modal personalizado.

**Parámetros:**
- `title` (string): Título del modal
- `message` (string): Contenido del modal
- `showCancel` (boolean): Si es `false`, ocultar el botón de cancelar

**Ejemplo:**
```javascript
showModal('Error', 'No se pudo realizar la operación', true);
showModal('Confirmación', '¿Estás seguro?', false);
```

### showModalConfirm(modalId, title, message, confirmAction)

Mostrar un modal de confirmación específico.

**Parámetros:**
- `modalId` (string): ID del modal específico
- `title` (string): Título del modal
- `message` (string): Mensaje de confirmación
- `confirmAction` (function): Acción a ejecutar al confirmar

**Ejemplo:**
```javascript
showModalConfirm('deleteProductModal', '¿Eliminar producto?', 
  '¿Estás seguro?', () => {
    deleteProductConfirmed(id);
  });
```

## Vistas que usan el Modal

- `src/views/admin/adminProducts.ejs` - Eliminar productos
- `src/views/admin/adminCategories.ejs` - Eliminar categorías
- `src/views/admin/settings.ejs` - Guardar configuraciones
- `src/views/admin/adminOrders.ejs` - Cargar más órdenes, actualizar estado
- `src/views/checkout.ejs` - Carrito vacío, error al crear pedido
- `src/views/checkoutSuccess.ejs` - Error al copiar orden

## Ventajas sobre alert()

1. **Mejor UX**: Los modales son menos intrusivos que las alertas
2. **Personalizable**: Puedes mostrar mensajes HTML personalizados
3. **Botón de cancelar**: Opcional, con `showCancel: false`
4. **Reutilizable**: Una sola implementación en `modal.js`
5. **Accesible**: Cumple con estándares de accesibilidad
