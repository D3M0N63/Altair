// ENDPOINT TEMPORAL — Úsalo UNA VEZ para generar tu hash, luego bórralo
// GET /api/auth/hash?password=TU_CONTRASEÑA
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  const { password, secret } = req.query;

  // Protección mínima: requiere un token de setup
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Falta el parámetro ?password=' });
  }

  const hash = await bcrypt.hash(password, 10);

  res.status(200).json({
    hash,
    instrucciones: 'Copia este hash y ponlo en la variable ADMIN_PASSWORD_HASH de Vercel. Luego borra este archivo.'
  });
};
