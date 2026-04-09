const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { cors } = require('../_auth');

module.exports = async (req, res) => {
  cors(res, 'POST');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Método no permitido' });

  // Verificar que las env vars estén configuradas
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
    console.error('Faltan variables de entorno:', {
      ADMIN_EMAIL:         !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD_HASH: !!process.env.ADMIN_PASSWORD_HASH,
      JWT_SECRET:          !!process.env.JWT_SECRET,
    });
    return res.status(500).json({ error: 'Servidor mal configurado' });
  }

  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    if (email !== process.env.ADMIN_EMAIL)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, email });

  } catch (err) {
    console.error('Error en login:', err.message);
    return res.status(500).json({ error: 'Error interno: ' + err.message });
  }
};
