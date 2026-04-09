const { sql }                  = require('../_db');
const { requireAuth, cors }    = require('../_auth');

module.exports = async (req, res) => {
  cors(res, 'GET, PUT, DELETE');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  // GET /api/proyectos/:id — público
  if (req.method === 'GET') {
    const [row] = await sql`SELECT * FROM proyectos WHERE id = ${id}`;
    if (!row) return res.status(404).json({ error: 'Proyecto no encontrado' });
    return res.status(200).json(row);
  }

  // PUT /api/proyectos/:id — requiere auth
  if (req.method === 'PUT') {
    if (!requireAuth(req, res)) return;
    const { titulo, descripcion, funcionalidades, proyecto_url, imagen_url } = req.body || {};
    const [row] = await sql`
      UPDATE proyectos
      SET titulo          = ${titulo},
          descripcion     = ${descripcion},
          funcionalidades = ${funcionalidades},
          proyecto_url    = ${proyecto_url},
          imagen_url      = ${imagen_url}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: 'Proyecto no encontrado' });
    return res.status(200).json(row);
  }

  // DELETE /api/proyectos/:id — requiere auth
  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;
    await sql`DELETE FROM proyectos WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Método no permitido' });
};
