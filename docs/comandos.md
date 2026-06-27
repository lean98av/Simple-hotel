crear una migracion 
npx sequelize-cli migration:create --name initial-migration

ejecuta migraciones
npm run migrate


ejecuta script de seed de datos, el user de admin a veces no se ejecuta con el script, usar el scritp sql directamente en ese caso
node scripts/seed-all.js