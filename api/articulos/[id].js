const { sql }                  = require('../_db');
const { requireAuth, cors }    = require('../_auth');

module.exports = async (req, res) => {
  cors(res, 'GET, DELETE');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  // GET /api/articulos/:id — público
  if (req.method === 'GET') {
    const [row] = await sql`SELECT * FROM articulos WHERE id = ${id}`;
    if (!row) return res.status(404).json({ error: 'Artículo no encontrado' });
    return res.status(200).json(row);
  }

  // DELETE /api/articulos/:id — requiere auth
  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;
    await sql`DELETE FROM articulos WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Método no permitido' });
};
