import dotenv from 'dotenv';
import { testConnection } from './utils/connection-test';
import { logger } from './utils/logger';

// Cargar variables de entorno
dotenv.config();

async function main() {
  logger.info('🚀 Iniciando aplicación Sazon Patrimonial - Infraestructura');
  logger.info('================================================\n');

  // Probar conexión a la base de datos
  const isConnected = await testConnection();

  if (isConnected) {
    logger.success('✅ Sistema listo para operar');
    logger.info('📊 Puedes acceder a:');
    logger.info('   - Prisma Studio: http://localhost:5555');
    logger.info('   - pgAdmin: http://localhost:5050');
  } else {
    logger.error('❌ No se pudo establecer conexión con la base de datos');
    process.exit(1);
  }

  logger.info('\n================================================');
}

main().catch((error) => {
  logger.error('❌ Error fatal:', error);
  process.exit(1);
});