const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'antgravity_dev_secret_key';

/**
 * Middleware de autenticação JWT.
 * Verifica o token no header Authorization (Bearer <token>).
 */
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido.',
        code: 'AUTH_TOKEN_MISSING',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato do token inválido. Use: Bearer <token>.',
        code: 'AUTH_TOKEN_MALFORMED',
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado. Faça login novamente.',
        code: 'AUTH_TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido.',
        code: 'AUTH_TOKEN_INVALID',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Erro interno na verificação do token.',
    });
  }
}

/**
 * Gera um token JWT para o usuário.
 * @param {object} payload - Dados do usuário (id, email).
 * @returns {string} Token JWT assinado.
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { verifyToken, generateToken };
