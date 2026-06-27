import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  LOG_INTERVAL: parseInt(process.env.LOG_INTERVAL || '10200', 10),
};

export default env;
