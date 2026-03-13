-- ==========================================
-- SCRIPT DDL: CREACIÓN DE TIPOS Y TABLAS
-- ==========================================

-- 1. CREACIÓN DE ENUMS
CREATE TYPE "ApplicationStatus" AS ENUM ('pendiente', 'aprobado', 'rechazado', 'en_revision');
CREATE TYPE "DownloadOrigin" AS ENUM ('Nacional', 'Extranjero');
CREATE TYPE "OpinionType" AS ENUM ('La_comida', 'La_ubicacion', 'Recomendacion', 'El_horario', 'La_vista');

-- 2. CREACIÓN DE TABLAS (Ordenadas para respetar la integridad referencial)

CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(50) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "foto_evidencia" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

CREATE TABLE "administrator" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "administrator_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "client" (
    "userId" INTEGER NOT NULL,
    "phone" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "client_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "restaurant_owner" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restaurant_owner_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "solicitud_registro" (
    "id_solicitud" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" VARCHAR(45) NOT NULL,
    "nombre_propuesto_restaurante" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(45) NOT NULL,
    "nombre_propietario" VARCHAR(45) NOT NULL,
    "horario_atencion" VARCHAR(255),
    "id_restaurante" INTEGER,
    "id_usuario" INTEGER NOT NULL,
    "direccion" VARCHAR(500),
    "etiquetas" VARCHAR(200),
    "facebook" VARCHAR(100),
    "foto_portada" VARCHAR(500),
    "instagram" VARCHAR(100),
    "menu_pdf" VARCHAR(500),
    "telefono" VARCHAR(45),
    "foto_2" VARCHAR(500),
    "foto_3" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "solicitud_registro_pkey" PRIMARY KEY ("id_solicitud")
);

CREATE TABLE "restaurante" (
    "id_restaurante" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "horario" VARCHAR(45),
    "telefono" VARCHAR(45),
    "etiquetas" VARCHAR(200),
    "id_solicitud" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "direccion" VARCHAR(45),
    "link_direccion" TEXT,
    "facebook" VARCHAR(100),
    "instagram" VARCHAR(100),
    "zona" VARCHAR(100),
    "horario_atencion" VARCHAR(255),
    "foto_portada" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restaurante_pkey" PRIMARY KEY ("id_restaurante")
);

CREATE TABLE "application" (
    "id" SERIAL NOT NULL,
    "proposedRestaurantName" VARCHAR(100) NOT NULL,
    "ownerName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "schedule" VARCHAR(255) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pendiente',
    "ownerId" INTEGER NOT NULL,
    "restaurantId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "comprobante" (
    "id_comprobante" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "ruta_archivo" VARCHAR(500) NOT NULL,
    "fecha_subida" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_restaurante" INTEGER NOT NULL,
    "id_solicitud" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "comprobante_pkey" PRIMARY KEY ("id_comprobante")
);

CREATE TABLE "download" (
    "id" SERIAL NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "origin" "DownloadOrigin" NOT NULL,
    "opinion" "OpinionType" NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "download_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favoritos" (
    "id_favorito" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,
    "fecha_favorito" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id_favorito")
);

CREATE TABLE "menu" (
    "id_menu" SERIAL NOT NULL,
    "ruta_archivo" VARCHAR(500) NOT NULL,
    "id_restaurante" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "contador_descargas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "menu_pkey" PRIMARY KEY ("id_menu")
);

CREATE TABLE "revision_solicitud" (
    "id_revision" SERIAL NOT NULL,
    "fecha" VARCHAR(45) NOT NULL,
    "id_solicitud" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "revision_solicitud_pkey" PRIMARY KEY ("id_revision")
);

CREATE TABLE "foto_usuario" (
    "id_foto" SERIAL NOT NULL,
    "url_foto" VARCHAR(500) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "foto_usuario_pkey" PRIMARY KEY ("id_foto")
);

CREATE TABLE "encuesta_restaurante" (
    "id_encuesta" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_restaurante" INTEGER NOT NULL,
    "atraccion" VARCHAR(50),
    "origen" VARCHAR(50),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "encuesta_restaurante_pkey" PRIMARY KEY ("id_encuesta")
);

-- 3. ÍNDICES Y RESTRICCIONES UNIQUE
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");
CREATE UNIQUE INDEX "application_restaurantId_key" ON "application"("restaurantId");
CREATE UNIQUE INDEX "favoritos_id_usuario_id_restaurante_key" ON "favoritos"("id_usuario", "id_restaurante");
CREATE UNIQUE INDEX "encuesta_restaurante_id_usuario_id_restaurante_key" ON "encuesta_restaurante"("id_usuario", "id_restaurante");

-- 4. LLAVES FORÁNEAS (FOREIGN KEYS)
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "client" ADD CONSTRAINT "client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "restaurant_owner" ADD CONSTRAINT "restaurant_owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "solicitud_registro" ADD CONSTRAINT "solicitud_registro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "restaurante" ADD CONSTRAINT "restaurante_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_registro"("id_solicitud") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "restaurante" ADD CONSTRAINT "restaurante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application" ADD CONSTRAINT "application_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "restaurant_owner"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "application" ADD CONSTRAINT "application_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurante"("id_restaurante") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "comprobante" ADD CONSTRAINT "comprobante_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id_restaurante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comprobante" ADD CONSTRAINT "comprobante_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_registro"("id_solicitud") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comprobante" ADD CONSTRAINT "comprobante_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "download" ADD CONSTRAINT "download_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "restaurant_owner"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id_restaurante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu" ADD CONSTRAINT "menu_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id_restaurante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu" ADD CONSTRAINT "menu_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "revision_solicitud" ADD CONSTRAINT "revision_solicitud_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_registro"("id_solicitud") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "revision_solicitud" ADD CONSTRAINT "revision_solicitud_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "foto_usuario" ADD CONSTRAINT "foto_usuario_id_restaurante_fkey" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id_restaurante") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "foto_usuario" ADD CONSTRAINT "foto_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;