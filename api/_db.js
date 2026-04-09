const { neon, neonConfig } = require('@neondatabase/serverless');

// Fuerza el transporte HTTP en lugar de WebSocket/TCP
// Requerido para Vercel serverless functions (Node.js runtime)
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);

module.exports = { sql };
