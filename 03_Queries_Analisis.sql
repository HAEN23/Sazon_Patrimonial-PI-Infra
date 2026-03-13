
-- 5 QUERIES DE ANÁLISIS PARA EL PROYECTO INTEGRADOR

-- QUERY 1: Vinculado a la Métrica de la Hipótesis (Porcentaje de extranjeros vs nacionales)
-- Cumple: Funciones de agregación, campos calculados con CASE y operaciones aritméticas.
SELECT 
    r.nombre AS restaurante,
    COUNT(e.id_encuesta) AS total_encuestas,
    SUM(CASE WHEN e.origen = 'Extranjero' THEN 1 ELSE 0 END) AS encuestas_extranjeros,
    ROUND((SUM(CASE WHEN e.origen = 'Extranjero' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(e.id_encuesta), 0), 2) AS porcentaje_extranjeros
FROM "restaurante" r
LEFT JOIN "encuesta_restaurante" e ON r.id_restaurante = e.id_restaurante
GROUP BY r.nombre
HAVING COUNT(e.id_encuesta) > 0;

-- QUERY 2: Rendimiento y popularidad de los menús
-- Cumple: JOINs de 2 tablas, COALESCE, y campo calculado cualitativo (CASE).
SELECT 
    r.nombre AS restaurante,
    COALESCE(SUM(m.contador_descargas), 0) AS total_descargas_menu,
    CASE 
        WHEN SUM(m.contador_descargas) > 50 THEN 'Alta Demanda'
        WHEN SUM(m.contador_descargas) BETWEEN 10 AND 50 THEN 'Demanda Media'
        ELSE 'Baja Demanda'
    END AS clasificacion_demanda
FROM "restaurante" r
LEFT JOIN "menu" m ON r.id_restaurante = m.id_restaurante
GROUP BY r.nombre;

-- QUERY 3: Análisis de Zonas más populares
-- Cumple: JOINs, funciones de agregación (COUNT) y GROUP BY con HAVING para filtrar grupos.
SELECT 
    r.zona AS zona_turistica,
    COUNT(f.id_favorito) AS total_veces_favorito
FROM "restaurante" r
JOIN "favoritos" f ON r.id_restaurante = f.id_restaurante
WHERE r.zona IS NOT NULL
GROUP BY r.zona
HAVING COUNT(f.id_favorito) >= 5
ORDER BY total_veces_favorito DESC;

-- QUERY 4: Tasa de conversión/aprobación de solicitudes de registro
-- Cumple: Operaciones aritméticas, agrupación por periodos de tiempo y CASE.
SELECT 
    EXTRACT(MONTH FROM fecha) AS mes_solicitud,
    COUNT(id_solicitud) AS total_solicitudes,
    SUM(CASE WHEN estado = 'Aprobado' THEN 1 ELSE 0 END) AS aprobadas,
    SUM(CASE WHEN estado = 'Rechazado' THEN 1 ELSE 0 END) AS rechazadas,
    ROUND((SUM(CASE WHEN estado = 'Aprobado' THEN 1 ELSE 0 END) * 100.0) / COUNT(id_solicitud), 2) AS tasa_aprobacion_porcentaje
FROM "solicitud_registro"
GROUP BY EXTRACT(MONTH FROM fecha);

-- QUERY 5: Nivel de fidelización e interacción de los usuarios (Engagement)
-- Cumple: JOIN de 3 tablas (usuario, favoritos, foto_usuario), múltiples COUNT DISTINCT.
SELECT 
    u.nombre AS nombre_cliente,
    u.correo,
    COUNT(DISTINCT f.id_favorito) AS restaurantes_marcados_favoritos,
    COUNT(DISTINCT fu.id_foto) AS fotos_subidas_como_evidencia
FROM "usuario" u
JOIN "favoritos" f ON u.id_usuario = f.id_usuario
LEFT JOIN "foto_usuario" fu ON u.id_usuario = fu.id_usuario
GROUP BY u.id_usuario, u.nombre, u.correo
HAVING COUNT(DISTINCT f.id_favorito) > 1;