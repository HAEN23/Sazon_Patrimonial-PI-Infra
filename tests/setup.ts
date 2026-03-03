import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  console.log('🧪 Configurando ambiente de pruebas...');
  // Aquí puedes agregar configuración adicional
});

afterAll(async () => {
  await prisma.$disconnect();
  console.log('🧪 Pruebas finalizadas');
});

export { prisma };
