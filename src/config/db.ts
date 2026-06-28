import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//sin esto no funciona el .env
dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME || 'simple_hotel',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);



sequelize.sync({ force: false }).then(() => {
  console.log('Tablas sincronizadas');
}).catch((err) => {
  console.error('Error sincronizando tablas:', err);
});

export default sequelize;
