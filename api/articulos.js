const { sql }                  = require('./_db');
const { requireAuth, cors }    = require('./_auth');

module.exports = async (req, res) => {
  cors(res, 'GET, POST');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/articulos — público
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM articulos ORDER BY created_at DESC`;
    return res.status(200).json(rows);
  }

  // POST /api/articulos — requiere auth
  if (req.method === 'POST') {
    if (!requireAuth(req, res)) return;
    const { titulo, resumen, contenido, imagen_portada_url } = req.body || {};
    const [row] = await sql`
      INSERT INTO articulos (titulo, resumen, contenido, imagen_portada_url)
      VALUES (${titulo}, ${resumen}, ${contenido}, ${imagen_portada_url})
      RETURNING *
    `;
    return res.status(201).json(row);
  }

  res.status(405).json({ error: 'Método no permitido' });
};
