'use strict';

const mysql = require('mysql2/promise');
const config = require('../config/config.json');
const fs = require('fs');
const path = require('path');

async function seedAll() {
  const connection = await mysql.createConnection({
    host: config.development.host,
    user: config.development.username,
    password: config.development.password,
    database: config.development.database,
  });

  try {
    // 1. Seedar de categorías
    console.log('\n=== INSERTANDO CATEGORIAS ===');
    const categoriesFile = path.join(__dirname, '../seeders/1seedDeCategoriasScriptDB.sql');
    const categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
    const categoriesStatements = categoriesContent.split(';');
    for (const stmt of categoriesStatements) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed.startsWith('INSERT')) {
        await connection.query(trimmed);
      }
    }

    // 2. Seedar de productos
    console.log('\n=== INSERTANDO PRODUCTOS ===');
    const productsFile = path.join(__dirname, '../seeders/2seedDeProductosScriptDB.sql');
    const productsContent = fs.readFileSync(productsFile, 'utf8');
    const productsStatements = productsContent.split(';');
    for (const stmt of productsStatements) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed.startsWith('INSERT')) {
        await connection.query(trimmed);
      }
    }

    // 3. Insertar usuario admin
    console.log('\n=== INSERTANDO USUARIO ADMIN ===');
    const adminUserFile = path.join(__dirname, '../seeders/3insertAdminUser.sql');
    const adminUserContent = fs.readFileSync(adminUserFile, 'utf8');
    const adminUserStatements = adminUserContent.split(';');
    for (const stmt of adminUserStatements) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed.startsWith('INSERT')) {
        await connection.query(trimmed);
      }
    }

    console.log('\n✅ Todos los seeders ejecutados');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

seedAll();


//se ejecuta con node scripts/seed-all.js