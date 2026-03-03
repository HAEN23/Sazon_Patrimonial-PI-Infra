import { prisma } from '../client/prisma.client';
import { logger } from './logger';

export async function testConnection(): Promise<boolean> {
  try {
    logger.info('🔍 Probando conexión a la base de datos...');
    
    // Intentar una query simple
    await prisma.$queryRaw`SELECT 1`;
    
    logger.success('✅ Conexión exitosa a PostgreSQL');
    
    // Obtener información adicional
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    
    if (result && result.length > 0) {
      logger.info(`📊 ${result[0].version}`);
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
}