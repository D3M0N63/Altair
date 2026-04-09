// ENDPOINT TEMPORAL DE DIAGNÓSTICO — bórralo después
// GET /api/auth/hash?password=X&secret=Y        → genera hash
// GET /api/auth/hash?password=X&secret=Y&verify=1 → prueba las env vars actuales
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  const { password, secret, verify } = req.query;

  if (secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Falta ?password=' });
  }

  // Modo verificación: prueba contra las env vars guardadas
  if (verify) {
    const storedHash  = process.env.ADMIN_PASSWORD_HASH;
    const storedEmail = process.env.ADMIN_EMAIL;

    let bcryptOk = false;
    let bcryptError = null;
    try {
      bcryptOk = await bcrypt.compare(password, storedHash || '');
    } catch (e) {
      bcryptError = e.message;
    }

    return res.status(200).json({
      ADMIN_EMAIL_set:          !!storedEmail,
      ADMIN_EMAIL_value:        storedEmail || '(vacío)',
      ADMIN_PASSWORD_HASH_set:  !!storedHash,
      ADMIN_PASSWORD_HASH_preview: storedHash ? storedHash.slice(0, 10) + '...' : '(vacío)',
      JWT_SECRET_set:           !!process.env.JWT_SECRET,
      bcrypt_compare_result:    bcryptOk,
      bcrypt_error:             bcryptError,
    });
  }

  // Modo generación: crea un hash nuevo
  const hash = await bcrypt.hash(password, 10);
  return res.status(200).json({
    hash,
    nota: 'Copia este valor completo en ADMIN_PASSWORD_HASH. Luego llama con &verify=1 para confirmar.'
  });
};
