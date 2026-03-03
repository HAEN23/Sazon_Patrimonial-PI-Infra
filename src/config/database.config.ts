import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'sazon_admin',
  password: process.env.DB_PASSWORD || 'sazon_secure_2024',
  database: process.env.DB_NAME || 'sazon_patrimonial',
  url: process.env.DATABASE_URL,
};

export const validateDatabaseConfig = (): boolean => {
  const requiredVars = ['DATABASE_URL', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ Variable de entorno faltante: ${varName}`);
      return false;
    }
  }
  
  return true;
};