const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const { cors } = require('../_auth');

module.exports = async (req, res) => {
  cors(res, 'POST');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Método no permitido' });

  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  if (email !== process.env.ADMIN_EMAIL)
    return res.status(401).json({ error: 'Credenciales inválidas' });

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid)
    return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, email });
};
