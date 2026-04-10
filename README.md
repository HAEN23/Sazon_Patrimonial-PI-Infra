# Sazón Patrimonial - Infraestructura y Base de Datos

Este repositorio centraliza la gestión del modelo de datos, la configuración de la base de datos relacional y los scripts de inicialización del proyecto Sazón Patrimonial.

## Arquitectura y Tecnologías
* **Motor de Base de Datos:** PostgreSQL (Alojado en nube/Render).
* **Modelado y Migraciones:** Prisma ORM (`schema.prisma`).
* **Scripts:** Archivos SQL para DDL y requerimientos específicos de análisis.

* ## Modelo de Datos
El esquema está completamente normalizado y cuenta con manejo estricto de integridad referencial.
* **Llaves foráneas y restricciones:** Eliminación en cascada (`onDelete: Cascade`) y relaciones consistentes entre tablas maestras.
* **Entidades Principales:** `usuario`, `rol`, `restaurante`, `encuesta_restaurante`, `favoritos`, `menu`, `solicitud_registro`.

* ## Comandos de Administración de Base de Datos

Para sincronizar la estructura definida en `schema.prisma` con la base de datos de PostgreSQL en producción de forma segura (sin pérdida de datos), se utilizan los siguientes comandos en bash:
# Sincroniza el esquema con la base de datos forzando la actualización de columnas
npx prisma db push

# Regenera los tipos de TypeScript para el uso del cliente Prisma
npx prisma generate

## Durante el desarrollo de este proyecto, se utilizó asistencia de Inteligencia Artificial (Gemini) estrictamente como herramienta de consulta para la administración segura de la base de datos en producción:

Gestión de Migraciones en Producción: Asesoría sobre comandos seguros (db push vs migrate dev) para la adición de columnas dinámicas (String? opcionales) a tablas existentes en PostgreSQL alojadas en Render, evitando la pérdida de registros activos.

El modelo relacional completo, las entidades, la normalización, las restricciones lógicas y la elaboración de los scripts SQL fueron diseñados, comprendidos e implementados en su totalidad por el equipo.
