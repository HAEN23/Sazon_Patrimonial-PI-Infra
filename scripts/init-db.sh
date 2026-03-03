#!/bin/bash
set -e

echo "🚀 Inicializando base de datos PostgreSQL..."
echo "================================================"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Habilitar extensiones necesarias
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Configurar zona horaria
    SET timezone = 'America/Mexico_City';
    
    -- Mensaje de éxito
    SELECT 'Base de datos inicializada correctamente' AS mensaje;
    SELECT version() AS version_postgresql;
EOSQL

echo "================================================"
echo "✅ Base de datos inicializada exitosamente!"
echo "================================================"