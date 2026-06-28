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
