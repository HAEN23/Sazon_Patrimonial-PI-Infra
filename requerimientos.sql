-- 1. RESTRICCIONES CHECK
ALTER TABLE "restaurante" ADD CONSTRAINT "chk_nombre_valido" CHECK (length("nombre") > 0);
ALTER TABLE "menu" ADD CONSTRAINT "chk_contador_positivo" CHECK ("contador_descargas" >= 0);

-- 2. VISTAS
CREATE OR REPLACE VIEW vw_restaurantes_con_duenos AS
SELECT r.id_restaurante, r.nombre, u.nombre AS nombre_dueno, u.correo
FROM "restaurante" r
JOIN "usuario" u ON r.id_usuario = u.id_usuario;

CREATE OR REPLACE VIEW vw_estadisticas_restaurante AS
SELECT r.id_restaurante, r.nombre, COUNT(f.id_favorito) as total_favoritos
FROM "restaurante" r
LEFT JOIN "favoritos" f ON r.id_restaurante = f.id_restaurante
GROUP BY r.id_restaurante, r.nombre;

CREATE OR REPLACE VIEW vw_metrica_hipotesis_encuestas AS
SELECT e.id_restaurante, r.nombre, e.origen, COUNT(e.id_encuesta) as encuestas_totales
FROM "encuesta_restaurante" e
JOIN "restaurante" r ON e.id_restaurante = r.id_restaurante
GROUP BY e.id_restaurante, r.nombre, e.origen;

-- 3. FUNCIONES
CREATE OR REPLACE FUNCTION fn_total_menus(rest_id INT) RETURNS INT AS $$
DECLARE total INT;
BEGIN
  SELECT COUNT(*) INTO total FROM "menu" WHERE id_restaurante = rest_id;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_obtener_favoritos_usuario(user_id INT) 
RETURNS TABLE(nombre_restaurante VARCHAR, fecha DATE) AS $$
BEGIN
  RETURN QUERY 
  SELECT r.nombre::VARCHAR, f.fecha_favorito::DATE 
  FROM "favoritos" f 
  JOIN "restaurante" r ON f.id_restaurante = r.id_restaurante 
  WHERE f.id_usuario = user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. STORED PROCEDURES
CREATE OR REPLACE PROCEDURE sp_aprobar_solicitud_visual(p_solicitud_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "solicitud_registro" SET estado = 'Aprobado' WHERE id_solicitud = p_solicitud_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_eliminar_usuario_seguro(user_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM "favoritos" WHERE id_usuario = user_id;
  DELETE FROM "encuesta_restaurante" WHERE id_usuario = user_id;
  COMMIT;
END;
$$;

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
    EXIT WHEN NOT FOUND;
    IF v_contador < 0 THEN
       UPDATE "menu" SET contador_descargas = 0 WHERE id_menu = v_id;
    END IF;
  END LOOP;
  CLOSE menu_cursor;
END;
$$;

-- 5. TRIGGERS
CREATE OR REPLACE FUNCTION trg_update_timestamp_func()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_restaurante_updated_at_audit ON "restaurante";
CREATE TRIGGER trg_restaurante_updated_at_audit
BEFORE UPDATE ON "restaurante"
FOR EACH ROW
EXECUTE FUNCTION trg_update_timestamp_func();

CREATE OR REPLACE FUNCTION trg_check_spam_favoritos()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM "favoritos" WHERE id_usuario = NEW.id_usuario) > 1000 THEN
     RAISE EXCEPTION 'Usuario bloqueado por posible bot (Exceso de favoritos)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evitar_bots_favoritos ON "favoritos";
CREATE TRIGGER trg_evitar_bots_favoritos
BEFORE INSERT ON "favoritos"
FOR EACH ROW
EXECUTE FUNCTION trg_check_spam_favoritos();