import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // ========== ROLES ==========
    console.log('📌 Creando roles...');
    const rolAdmin = await prisma.rol.upsert({
      where: { id_rol: 1 },
      update: {},
      create: { id_rol: 1, nombre_rol: 'Administrador' },
    });

    const rolRestaurantero = await prisma.rol.upsert({
      where: { id_rol: 2 },
      update: {},
      create: { id_rol: 2, nombre_rol: 'Restaurantero' },
    });

    const rolUsuario = await prisma.rol.upsert({
      where: { id_rol: 3 },
      update: {},
      create: { id_rol: 3, nombre_rol: 'Usuario' },
    });

    console.log('✅ Roles creados');
    console.log(`   - ${rolAdmin.nombre_rol} (ID: ${rolAdmin.id_rol})`);
    console.log(`   - ${rolRestaurantero.nombre_rol} (ID: ${rolRestaurantero.id_rol})`);
    console.log(`   - ${rolUsuario.nombre_rol} (ID: ${rolUsuario.id_rol})\n`);

    // ========== USUARIOS ==========
    console.log('📌 Creando usuarios...');
    const admin = await prisma.usuario.upsert({
      where: { correo: 'admin@sazonpatrimonial.com' },
      update: {},
      create: {
        nombre: 'Admin Principal',
        correo: 'admin@sazonpatrimonial.com',
        contrasena: 'admin123',
        id_rol: rolAdmin.id_rol,
        foto_evidencia: null,
      },
    });

    const restaurantero = await prisma.usuario.upsert({
      where: { correo: 'carlos@restaurante.com' },
      update: {},
      create: {
        nombre: 'Carlos Restaurantero',
        correo: 'carlos@restaurante.com',
        contrasena: 'rest123',
        id_rol: rolRestaurantero.id_rol,
        foto_evidencia: '/uploads/evidencias/carlos.jpg',
      },
    });

    const usuario1 = await prisma.usuario.upsert({
      where: { correo: 'juan@example.com' },
      update: {},
      create: {
        nombre: 'Juan Usuario',
        correo: 'juan@example.com',
        contrasena: 'user123',
        id_rol: rolUsuario.id_rol,
        foto_evidencia: null,
      },
    });

    console.log('✅ Usuarios creados');
    console.log(`   - ${admin.nombre} (${admin.correo})`);
    console.log(`   - ${restaurantero.nombre} (${restaurantero.correo})`);
    console.log(`   - ${usuario1.nombre} (${usuario1.correo})\n`);

    // ========== SOLICITUD DE REGISTRO ==========
    console.log('📌 Creando solicitud de registro...');
    const solicitud = await prisma.solicitudRegistro.create({
      data: {
        fecha: new Date('2024-01-15'),
        estado: 'Aprobado',
        nombre_propuesto_restaurante: 'La Casa del Sabor',
        correo: 'contacto@casadelsabor.com',
        nombre_propietario: 'Carlos Restaurantero',
        horario_atencion: 'Lun-Dom: 10:00 AM - 10:00 PM',
        id_restaurante: 1,
        id_usuario: restaurantero.id_usuario,
      },
    });

    console.log('✅ Solicitud creada');
    console.log(`   - ID: ${solicitud.id_solicitud}`);
    console.log(`   - Restaurante: ${solicitud.nombre_propuesto_restaurante}`);
    console.log(`   - Estado: ${solicitud.estado}\n`);

    // ========== RESTAURANTE ==========
    console.log('📌 Creando restaurante...');
    const restaurante = await prisma.restaurante.create({
      data: {
        nombre: 'La Casa del Sabor',
        horario: 'Lun-Dom: 10:00-22:00',
        telefono: '5551234567',
        etiquetas: 'Mexicana,Tradicional,Familiar',
        id_solicitud: solicitud.id_solicitud,
        id_usuario: restaurantero.id_usuario,
        direccion: 'Av. Principal 123, Col. Centro',
        link_direccion: 'https://maps.google.com/?q=19.432608,-99.133209',
        facebook: 'https://facebook.com/casadelsabor',
        instagram: 'https://instagram.com/casadelsabor',
        zona: 'Centro',
        horario_atencion: 'Lun-Dom: 10:00 AM - 10:00 PM',
        foto_portada: '/uploads/restaurantes/casa-sabor-portada.jpg',
      },
    });

    console.log('✅ Restaurante creado');
    console.log(`   - ID: ${restaurante.id_restaurante}`);
    console.log(`   - Nombre: ${restaurante.nombre}`);
    console.log(`   - Zona: ${restaurante.zona}\n`);

    // ========== REVISIÓN DE SOLICITUD ==========
    console.log('📌 Creando revisión de solicitud...');
    await prisma.revisionSolicitud.create({
      data: {
        fecha: '2024-01-16',
        id_solicitud: solicitud.id_solicitud,
        id_usuario: admin.id_usuario,
      },
    });

    console.log('✅ Revisión creada\n');

    // ========== COMPROBANTE ==========
    console.log('📌 Creando comprobante...');
    await prisma.comprobante.create({
      data: {
        id_comprobante: 'COMP-001',
        tipo: 'RFC',
        ruta_archivo: '/uploads/comprobantes/rfc-casa-sabor.pdf',
        fecha_subida: new Date('2024-01-15'),
        id_restaurante: restaurante.id_restaurante,
        id_solicitud: solicitud.id_solicitud,
        id_usuario: restaurantero.id_usuario,
      },
    });

    console.log('✅ Comprobante creado\n');

    // ========== MENÚ ==========
    console.log('📌 Creando menú...');
    await prisma.menu.create({
      data: {
        ruta_archivo: '/uploads/menus/menu-casa-sabor.pdf',
        id_restaurante: restaurante.id_restaurante,
        id_usuario: restaurantero.id_usuario,
        contador_descargas: 0,
      },
    });

    console.log('✅ Menú creado\n');

    // ========== FAVORITOS ==========
    console.log('📌 Creando favoritos...');
    await prisma.favoritos.create({
      data: {
        id_usuario: usuario1.id_usuario,
        id_restaurante: restaurante.id_restaurante,
        fecha_favorito: new Date(),
      },
    });

    console.log('✅ Favorito creado\n');

    console.log('🎉 ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - 3 roles`);
    console.log(`   - 3 usuarios`);
    console.log(`   - 1 solicitud de registro`);
    console.log(`   - 1 restaurante`);
    console.log(`   - 1 revisión`);
    console.log(`   - 1 comprobante`);
    console.log(`   - 1 menú`);
    console.log(`   - 1 favorito\n`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });