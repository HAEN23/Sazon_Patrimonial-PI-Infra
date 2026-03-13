-- ==========================================
-- 1. RESTRICCIONES CHECK (Mínimo 2)
-- ==========================================
DROP FUNCTION IF EXISTS fn_obtener_favoritos_usuario(integer) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_usuario_seguro(integer);

ALTER TABLE "restaurante" ADD CONSTRAINT "chk_nombre_valido" CHECK (length("nombre") > 0);
ALTER TABLE "menu" ADD CONSTRAINT "chk_contador_positivo" CHECK ("contador_descargas" >= 0);

-- ==========================================
-- 2. FUNCIONES (Mínimo 2: 1 escalar usada en query, 1 tabulada)
-- ==========================================
-- Función escalar
CREATE OR REPLACE FUNCTION fn_total_menus(rest_id INT) RETURNS INT AS $$
DECLARE total INT;
BEGIN
  SELECT COUNT(*) INTO total FROM "menu" WHERE id_restaurante = rest_id;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Función tabulada (corregida sintaxis a RETURN QUERY)
CREATE OR REPLACE FUNCTION fn_obtener_favoritos_usuario(p_user_id INT) 
RETURNS TABLE(nombre_restaurante VARCHAR, fecha_favorito DATE) AS $$
BEGIN
  RETURN QUERY 
  SELECT r.nombre::VARCHAR, f.fecha_favorito::DATE 
  FROM "favoritos" f 
  JOIN "restaurante" r ON f.id_restaurante = r.id_restaurante 
  WHERE f.id_usuario = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 3. VISTAS (Mínimo 3)
-- ==========================================
-- a) 1 view con JOIN de 2+ tablas
CREATE OR REPLACE VIEW vw_restaurantes_con_duenos AS
SELECT r.id_restaurante, r.nombre, u.nombre AS nombre_dueno, u.correo
FROM "restaurante" r
JOIN "usuario" u ON r.id_usuario = u.id_usuario;

-- b) 1 view con funciones de agregación (E Implementa la función escalar requerida)
CREATE OR REPLACE VIEW vw_estadisticas_restaurante AS
SELECT 
    r.id_restaurante, 
    r.nombre, 
    COUNT(f.id_favorito) as total_favoritos,
    fn_total_menus(r.id_restaurante) as total_menus_activos
FROM "restaurante" r
LEFT JOIN "favoritos" f ON r.id_restaurante = f.id_restaurante
GROUP BY r.id_restaurante, r.nombre;

-- c) 1 view para métrica de hipótesis
CREATE OR REPLACE VIEW vw_metrica_hipotesis_encuestas AS
SELECT e.id_restaurante, r.nombre, e.origen, COUNT(e.id_encuesta) as encuestas_totales
FROM "encuesta_restaurante" e
JOIN "restaurante" r ON e.id_restaurante = r.id_restaurante
GROUP BY e.id_restaurante, r.nombre, e.origen;

-- ==========================================
-- 4. STORED PROCEDURES (Requisitos A, B y C del profesor)
-- ==========================================

-- a) 1 con lógica de negocio compleja (NO un simple INSERT/UPDATE)
-- Evalúa el estado de una solicitud, y si está aprobada, migra sus datos automáticamente para crear un nuevo registro de restaurante y actualiza el tracking.
CREATE OR REPLACE PROCEDURE sp_procesar_solicitud_aprobada(p_id_solicitud INT)
LANGUAGE plpgsql AS $$
DECLARE
    v_estado VARCHAR;
    v_nombre_propuesto VARCHAR;
    v_id_usuario INT;
BEGIN
    -- 1. Leer datos a variables
    SELECT estado, nombre_propuesto_restaurante, id_usuario 
    INTO v_estado, v_nombre_propuesto, v_id_usuario
    FROM "solicitud_registro" 
    WHERE id_solicitud = p_id_solicitud;

    -- 2. Validar lógica de negocio
    IF v_estado != 'Aprobado' THEN
        RAISE EXCEPTION 'La solicitud % no está en estado Aprobado. Estado actual: %', p_id_solicitud, v_estado;
    END IF;

    -- 3. Impactar múltiples tablas con los datos recopilados
    INSERT INTO "restaurante" (nombre, id_solicitud, id_usuario, "createdAt", "updatedAt")
    VALUES (v_nombre_propuesto, p_id_solicitud, v_id_usuario, NOW(), NOW());

    UPDATE "solicitud_registro" SET estado = 'Procesado' WHERE id_solicitud = p_id_solicitud;
END;
$$;

-- b) 1 con transacción explícita (BEGIN/COMMIT/ROLLBACK con manejo de errores)
DROP PROCEDURE IF EXISTS sp_eliminar_usuario_seguro(integer);

CREATE OR REPLACE PROCEDURE sp_eliminar_usuario_seguro(p_user_id INT)
LANGUAGE plpgsql AS $$
DECLARE
    v_count_fav INT;
    v_count_enc INT;
BEGIN  -- ← BEGIN explícito de la transacción
    
    -- Validación previa: si falla, hacemos ROLLBACK
    IF NOT EXISTS (SELECT 1 FROM "usuario" WHERE id_usuario = p_user_id) THEN
        ROLLBACK;  -- ← ROLLBACK explícito
        RAISE EXCEPTION 'Usuario % no existe', p_user_id;
    END IF;
    
    -- Operación 1: Eliminar favoritos
    DELETE FROM "favoritos" WHERE id_usuario = p_user_id;
    GET DIAGNOSTICS v_count_fav = ROW_COUNT;
    
    -- Operación 2: Eliminar encuestas
    DELETE FROM "encuesta_restaurante" WHERE id_usuario = p_user_id;
    GET DIAGNOSTICS v_count_enc = ROW_COUNT;
    
    -- Si todo salió bien, hacemos COMMIT
    COMMIT;  -- ← COMMIT explícito
    
    RAISE NOTICE 'Eliminación exitosa. Favoritos eliminados: %, Encuestas eliminadas: %', v_count_fav, v_count_enc;
END;
$$;

-- c) 1 con cursores o lógica iterativa
CREATE OR REPLACE PROCEDURE sp_auditar_menus()
LANGUAGE plpgsql AS $$
DECLARE
  menu_cursor CURSOR FOR SELECT id_menu, contador_descargas FROM "menu";
  v_id INT;
  v_contador INT;
BEGIN
  OPEN menu_cursor;
  LOOP
    FETCH menu_cursor INTO v_id, v_contador;
    EXIT WHEN NOT FOUND; -- Condición de salida del bucle
    
    -- Lógica analizada registro por registro
    IF v_contador < 0 THEN
       UPDATE "menu" SET contador_descargas = 0 WHERE id_menu = v_id;
    END IF;
  END LOOP;
  CLOSE menu_cursor;
END;
$$;

-- ==========================================
-- 5. TRIGGERS (Mínimo 2)
-- ==========================================
CREATE OR REPLACE FUNCTION trg_update_timestamp_func() RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_restaurante_updated_at_audit ON "restaurante";
CREATE TRIGGER trg_restaurante_updated_at_audit
BEFORE UPDATE ON "restaurante" FOR EACH ROW
EXECUTE FUNCTION trg_update_timestamp_func();

CREATE OR REPLACE FUNCTION trg_check_spam_favoritos() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM "favoritos" WHERE id_usuario = NEW.id_usuario) > 1000 THEN
     RAISE EXCEPTION 'Usuario bloqueado por posible bot (Exceso de favoritos)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evitar_bots_favoritos ON "favoritos";
CREATE TRIGGER trg_evitar_bots_favoritos
BEFORE INSERT ON "favoritos" FOR EACH ROW
EXECUTE FUNCTION trg_check_spam_favoritos();

-- ==========================================
-- 6. CONSULTA REQUERIDA (CTEs y Subconsultas)
-- ==========================================
-- El documento pide al menos 1 query con CTE (WITH) y 2 subconsultas
-- Esta vista/query extra asegura ese punto:

CREATE OR REPLACE VIEW vw_analisis_top_restaurantes AS
WITH TopRestaurantes AS (
    -- CTE
    SELECT id_restaurante, COUNT(id_favorito) as cantidad_favoritos
    FROM "favoritos"
    GROUP BY id_restaurante
    HAVING COUNT(id_favorito) > 5
)
SELECT r.nombre, r.direccion, tr.cantidad_favoritos
FROM "restaurante" r
JOIN TopRestaurantes tr ON r.id_restaurante = tr.id_restaurante
WHERE r.id_usuario IN (SELECT id_usuario FROM "usuario" WHERE id_rol = 2) -- Subconsulta 1 (en el WHERE)
AND r.id_restaurante NOT IN (SELECT id_restaurante FROM "encuesta_restaurante" WHERE origen = 'Extranjero'); -- Subconsulta 2