const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const AntgravityEngine = require('../services/antgravityEngine');

const engine = new AntgravityEngine();

/**
 * @swagger
 * tags:
 *   name: Antgravity
 *   description: Integração com a Antgravity Engine (otimização, análise, deploy)
 */

// Todas as rotas Antgravity exigem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/antgravity/optimize:
 *   post:
 *     summary: Otimiza código ou pipeline via Antgravity Engine
 *     tags: [Antgravity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo]
 *             properties:
 *               codigo: { type: string }
 *     responses:
 *       200: { description: Código otimizado retornado }
 *       400: { description: Parâmetro ausente }
 */
router.post('/optimize', async (req, res, next) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({
        success: false,
        error: 'O campo "codigo" é obrigatório.',
        code: 'MISSING_CODE',
      });
    }

    const result = await engine.otimizarCodigo(codigo);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/antgravity/analyze:
 *   post:
 *     summary: Analisa a performance de código
 *     tags: [Antgravity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo]
 *             properties:
 *               codigo: { type: string }
 *     responses:
 *       200: { description: Métricas de performance retornadas }
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({
        success: false,
        error: 'O campo "codigo" é obrigatório.',
        code: 'MISSING_CODE',
      });
    }

    const result = await engine.analisarPerformance(codigo);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/antgravity/deploy:
 *   post:
 *     summary: Executa o deploy automático de um projeto
 *     tags: [Antgravity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200: { description: Deploy realizado com sucesso }
 */
router.post('/deploy', async (req, res, next) => {
  try {
    const projeto = req.body;

    if (!projeto || !projeto.name) {
      return res.status(400).json({
        success: false,
        error: 'O campo "name" do projeto é obrigatório.',
        code: 'MISSING_PROJECT_NAME',
      });
    }

    const result = await engine.deployAutomatico(projeto);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
