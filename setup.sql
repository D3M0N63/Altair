-- ================================================
-- Esquema para Altair en Neon PostgreSQL
-- Ejecuta este script en el SQL Editor de Neon
-- ================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS proyectos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  funcionalidades TEXT,
  proyecto_url    TEXT,
  imagen_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articulos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            TEXT NOT NULL,
  resumen           TEXT,
  contenido         TEXT,
  imagen_portada_url TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- Variables de entorno requeridas en Vercel:
--
-- NEON_DATABASE_URL    → Connection string de Neon
--                        (Settings → Connection string → Pooled)
--
-- JWT_SECRET           → String aleatorio largo, ej:
--                        node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
--
-- ADMIN_EMAIL          → tu@email.com
--
-- ADMIN_PASSWORD_HASH  → Hash bcrypt de tu contraseña, genera con:
--                        node -e "const b=require('bcryptjs');console.log(b.hashSync('TU_PASS',10))"
--
-- CLOUDINARY_CLOUD_NAME   → Tu cloud name de Cloudinary
-- CLOUDINARY_UPLOAD_PRESET → Nombre del upload preset sin firma (Settings > Upload > Add preset > Unsigned)
-- ================================================
