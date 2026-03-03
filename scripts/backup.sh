#!/bin/bash

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

# Configuración
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

echo "🔄 Iniciando backup de la base de datos..."
echo "================================================"
echo "📁 Archivo: $BACKUP_FILE"
echo "🗄️  Base de datos: $DB_NAME"
echo "================================================"

# Realizar backup
docker exec -t sazon_patrimonial_db pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -b -v > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "================================================"
    echo "✅ Backup completado exitosamente!"
    echo "📊 Tamaño: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Comprimir backup
    gzip "$BACKUP_FILE"
    echo "🗜️  Backup comprimido: ${BACKUP_FILE}.gz"
    
    # Limpiar backups antiguos (más de 30 días)
    DELETED=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS:-30} -delete -print | wc -l)
    echo "🧹 Backups antiguos eliminados: $DELETED"
    echo "================================================"
else
    echo "================================================"
    echo "❌ Error al realizar el backup"
    echo "================================================"
    exit 1
fi