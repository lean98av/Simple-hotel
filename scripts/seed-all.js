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
    // Nota: MySQL sin transacciones soportadas ejecuta consultas individuales

    // 1. Seeder de Categorías
    console.log('\n=== INSERTANDO CATEGORIAS ===');
    const categoriesFile = path.join(__dirname, '../seeders/1seedDeCategoriasScriptDB.sql');
    const categoriesContent = fs.readFileSync(categoriesFile, 'utf8');
    const categoriesStatements = categoriesContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && stmt.startsWith('INSERT'));
    for (const stmt of categoriesStatements) {
      try {
        await connection.query(stmt);
      } catch (error) {
        console.error('Error en seed de Categorías:', error.message);
        throw error;
      }
    }

    // 2. Seeder de SuitCategories (Categorías de Habitaciones)
    console.log('\n=== INSERTANDO SUIT CATEGORIES ===');
    const suitCategoriesFile = path.join(__dirname, '../seeders/2seedDeSuitCategoriesScriptDB.sql');
    const suitCategoriesContent = fs.readFileSync(suitCategoriesFile, 'utf8');
    const suitCategoriesStatements = suitCategoriesContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && stmt.startsWith('INSERT'));
    for (const stmt of suitCategoriesStatements) {
      try {
        await connection.query(stmt);
      } catch (error) {
        console.error('Error en seed de SuitCategories:', error.message);
        throw error;
      }
    }

    // 3. Seeder de Suits (Habitaciones)
    console.log('\n=== INSERTANDO SUITS (HABITACIONES) ===');
    const suitsFile = path.join(__dirname, '../seeders/3seedDeSuitsScriptDB.sql');
    const suitsContent = fs.readFileSync(suitsFile, 'utf8');
    const suitsStatements = suitsContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && stmt.startsWith('INSERT'));
    for (const stmt of suitsStatements) {
      try {
        await connection.query(stmt);
      } catch (error) {
        console.error('Error en seed de Suits:', error.message);
        throw error;
      }
    }

    // 4. Insertar usuario admin
    console.log('\n=== INSERTANDO USUARIO ADMIN ===');
    const adminUserFile = path.join(__dirname, '../seeders/4insertAdminUser.sql');
    const adminUserContent = fs.readFileSync(adminUserFile, 'utf8');
    const adminUserStatements = adminUserContent
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && stmt.startsWith('INSERT'));
    for (const stmt of adminUserStatements) {
      try {
        await connection.query(stmt);
      } catch (error) {
        console.error('Error al insertar usuario admin:', error.message);
        throw error;
      }
    }

    console.log('\n✅ Todos los seeders ejecutados correctamente');

  } catch (error) {
    console.error('Error al ejecutar seeders:', error.message);
    try {
      await connection.rollback();
    } catch (rollbackError) {
      // Ignorar errores al rollback si ya hubo un error
    }
    console.error('\n❗ Los seeders fallaron. Se ha realizado rollback.');
    throw error;
  } finally {
    await connection.end();
  }
}

seedAll();


//se ejecuta con node scripts/seed-all.js