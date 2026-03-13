import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
  
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

    
    console.log('📌 Creando usuarios con contraseñas hasheadas...');
    
   
    const adminPassword = await bcrypt.hash('admin123', 10);
    const restPassword = await bcrypt.hash('rest123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await prisma.usuario.upsert({
      where: { correo: 'admin@sazonpatrimonial.com' },
      update: { contrasena: adminPassword },
      create: {
        nombre: 'Admin Principal',
        correo: 'admin@sazonpatrimonial.com',
        contrasena: adminPassword,
        id_rol: rolAdmin.id_rol,
        foto_evidencia: null,
      },
    });

    const restaurantero = await prisma.usuario.upsert({
      where: { correo: 'carlos@restaurante.com' },
      update: { contrasena: restPassword },
      create: {
        nombre: 'Carlos Restaurantero',
        correo: 'carlos@restaurante.com',
        contrasena: restPassword,
        id_rol: rolRestaurantero.id_rol,
        foto_evidencia: '/uploads/evidencias/carlos.jpg',
      },
    });

    const usuario1 = await prisma.usuario.upsert({
      where: { correo: 'juan@example.com' },
      update: { contrasena: userPassword },
      create: {
        nombre: 'Juan Usuario',
        correo: 'juan@example.com',
        contrasena: userPassword,
        id_rol: rolUsuario.id_rol,
        foto_evidencia: null,
      },
    });

    console.log('✅ Usuarios creados con contraseñas hasheadas');
    console.log(`   - ${admin.nombre} (${admin.correo})`);
    console.log(`   - ${restaurantero.nombre} (${restaurantero.correo})`);
    console.log(`   - ${usuario1.nombre} (${usuario1.correo})\n`);

   
    console.log('📌 Creando solicitud de registro...');
    
    let solicitud = await prisma.solicitud_registro.findFirst({
      where: {
        nombre_propuesto_restaurante: 'La Casa del Sabor',
        id_usuario: restaurantero.id_usuario,
      },
    });

    if (!solicitud) {
      solicitud = await prisma.solicitud_registro.create({
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
    }

    console.log('✅ Solicitud creada\n');

    // ========== RESTAURANTE ==========
    console.log('📌 Creando restaurante...');
    
    let restaurante = await prisma.restaurante.findFirst({
      where: {
        nombre: 'La Casa del Sabor',
        id_usuario: restaurantero.id_usuario,
      },
    });

    if (!restaurante) {
      restaurante = await prisma.restaurante.create({
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
    }

    console.log('✅ Restaurante creado\n');

    // ========== REVISIÓN DE SOLICITUD ==========
    console.log('📌 Creando revisión de solicitud...');
    
    const revisionExiste = await prisma.revision_solicitud.findFirst({
      where: {
        id_solicitud: solicitud.id_solicitud,
        id_usuario: admin.id_usuario,
      },
    });

    if (!revisionExiste) {
      await prisma.revision_solicitud.create({
        data: {
          fecha: '2024-01-16',
          id_solicitud: solicitud.id_solicitud,
          id_usuario: admin.id_usuario,
        },
      });
    }

    console.log('✅ Revisión creada\n');

    // ========== COMPROBANTE ==========
    console.log('📌 Creando comprobante...');
    
    const comprobanteExiste = await prisma.comprobante.findUnique({
      where: { id_comprobante: 'COMP-001' },
    });

    if (!comprobanteExiste) {
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
    } else {
      console.log('⏭️  Comprobante ya existe (omitido)\n');
    }

    // ========== MENÚ ==========
    console.log('📌 Creando menú...');
    
    const menuExiste = await prisma.menu.findFirst({
      where: {
        id_restaurante: restaurante.id_restaurante,
        ruta_archivo: '/uploads/menus/menu-casa-sabor.pdf',
      },
    });

    if (!menuExiste) {
      await prisma.menu.create({
        data: {
          ruta_archivo: '/uploads/menus/menu-casa-sabor.pdf',
          id_restaurante: restaurante.id_restaurante,
          id_usuario: restaurantero.id_usuario,
          contador_descargas: 0,
        },
      });
      console.log('✅ Menú creado\n');
    } else {
      console.log('⏭️  Menú ya existe (omitido)\n');
    }

    // ========== FAVORITOS ==========
    console.log('📌 Creando favoritos...');
    
    const favoritoExiste = await prisma.favoritos.findFirst({
      where: {
        id_usuario: usuario1.id_usuario,
        id_restaurante: restaurante.id_restaurante,
      },
    });

    if (!favoritoExiste) {
      await prisma.favoritos.create({
        data: {
          id_usuario: usuario1.id_usuario,
          id_restaurante: restaurante.id_restaurante,
          fecha_favorito: new Date(),
        },
      });
      console.log('✅ Favorito creado\n');
    } else {
      console.log('⏭️  Favorito ya existe (omitido)\n');
    }

    console.log('🎉 ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    
    const totalRoles = await prisma.rol.count();
    const totalUsuarios = await prisma.usuario.count();
    const totalRestaurantes = await prisma.restaurante.count();
    const totalSolicitudes = await prisma.solicitud_registro.count();

    console.log(`   - ${totalRoles} roles`);
    console.log(`   - ${totalUsuarios} usuarios`);
    console.log(`   - ${totalSolicitudes} solicitudes`);
    console.log(`   - ${totalRestaurantes} restaurantes\n`);
    
    console.log('🔑 Credenciales de prueba:');
    console.log('   Admin:');
    console.log('     - Correo: admin@sazonpatrimonial.com');
    console.log('     - Contraseña: admin123\n');
    console.log('   Restaurantero:');
    console.log('     - Correo: carlos@restaurante.com');
    console.log('     - Contraseña: rest123\n');
    console.log('   Usuario:');
    console.log('     - Correo: juan@example.com');
    console.log('     - Contraseña: user123\n');
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