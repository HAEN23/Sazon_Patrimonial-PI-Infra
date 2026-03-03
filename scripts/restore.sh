#!/bin/bash

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

# Verificar si se proporcionó un archivo de backup
if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar el archivo de backup"
    echo "Uso: ./scripts/restore.sh <archivo_backup.sql.gz>"
    echo ""
    echo "Backups disponibles:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || echo "  No hay backups disponibles"
    exit 1
fi

BACKUP_FILE="$1"

# Verificar si el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: El archivo $BACKUP_FILE no existe"
    exit 1
fi

echo "🔄 Iniciando restauración de la base de datos..."
echo "================================================"
echo "📁 Archivo: $BACKUP_FILE"
echo "🗄️  Base de datos: $DB_NAME"
echo "================================================"
echo "⚠️  ADVERTENCIA: Esto sobrescribirá los datos actuales"
read -p "¿Estás seguro? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restauración cancelada"
    exit 1
fi

# Descomprimir si es necesario
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "🗜️  Descomprimiendo backup..."
    gunzip -k "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restaurar backup
echo "📥 Restaurando backup..."
docker exec -i sazon_patrimonial_db pg_restore -U "$DB_USER" -d "$DB_NAME" -c -v < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "================================================"
    echo "✅ Restauración completada exitosamente!"
    echo "================================================"
    
    # Limpiar archivo descomprimido temporal
    if [[ $BACKUP_FILE != *.gz ]]; then
        rm -f "$BACKUP_FILE"
    fi
else
    echo "================================================"
    echo "❌ Error al restaurar el backup"
    echo "================================================"
    exit 1
fi