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
    // 1. Seeder de Categorías
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

    // 2. Seeder de SuitCategories (Categorías de Habitaciones)
    console.log('\n=== INSERTANDO SUIT CATEGORIES ===');
    const suitCategoriesFile = path.join(__dirname, '../seeders/2seedDeSuitCategoriesScriptDB.sql');
    const suitCategoriesContent = fs.readFileSync(suitCategoriesFile, 'utf8');
    const suitCategoriesStatements = suitCategoriesContent.split(';');
    for (const stmt of suitCategoriesStatements) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed.startsWith('INSERT')) {
        await connection.query(trimmed);
      }
    }

    // 3. Seeder de Suits (Habitaciones)
    console.log('\n=== INSERTANDO SUITS (HABITACIONES) ===');
    const suitsFile = path.join(__dirname, '../seeders/3seedDeSuitsScriptDB.sql');
    const suitsContent = fs.readFileSync(suitsFile, 'utf8');
    const suitsStatements = suitsContent.split(';');
    for (const stmt of suitsStatements) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed.startsWith('INSERT')) {
        await connection.query(trimmed);
      }
    }

    // 4. Insertar usuario admin
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