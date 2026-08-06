/**
 * Middleware global de tratamento de erros.
 * Captura todos os erros não tratados nas rotas e retorna JSON padronizado.
 */
function errorHandler(err, req, res, _next) {
  // Log detalhado no servidor
  console.error('─────────────────────────────────────────');
  console.error(`[ErrorHandler] ${new Date().toISOString()}`);
  console.error(`  Rota: ${req.method} ${req.originalUrl}`);
  console.error(`  Mensagem: ${err.message}`);
  if (err.stack) {
    console.error(`  Stack: ${err.stack}`);
  }
  console.error('─────────────────────────────────────────');

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors ? err.errors.map((e) => e.message) : [err.message];
    return res.status(422).json({
      success: false,
      error: 'Erro de validação.',
      details: messages,
      code: 'VALIDATION_ERROR',
    });
  }

  // Erros de sintaxe JSON no body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido no corpo da requisição.',
      code: 'INVALID_JSON',
    });
  }

  // Erro customizado com statusCode
  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Erro interno do servidor.' : err.message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * Middleware para rotas não encontradas (404).
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
}

module.exports = { errorHandler, notFoundHandler };
