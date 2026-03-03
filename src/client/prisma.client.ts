import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

// Singleton pattern para PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

// Logging de queries en desarrollo
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: { query: string; duration: number }) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// En desarrollo, guardar la instancia globalmente
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Manejar cierre de la aplicación
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('🔌 Desconectado de la base de datos');
});

export default prisma;