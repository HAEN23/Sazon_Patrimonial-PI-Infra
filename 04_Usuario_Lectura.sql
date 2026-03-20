
CREATE USER profe_lectura WITH PASSWORD 'SazonChiapas2026';

GRANT CONNECT ON DATABASE "sazon_db" TO profe_lectura;

GRANT USAGE ON SCHEMA public TO profe_lectura;


GRANT SELECT ON ALL TABLES IN SCHEMA public TO profe_lectura;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO profe_lectura;