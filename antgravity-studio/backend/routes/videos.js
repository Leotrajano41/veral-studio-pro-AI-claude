const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const videoController = require('../controllers/videoController');

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Gerenciamento e geração automatizada de vídeos
 */

// Todas as rotas de vídeos exigem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Lista todos os vídeos do usuário
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada de vídeos }
 */
router.get('/', videoController.list);

/**
 * @swagger
 * /api/videos/generate:
 *   post:
 *     summary: Inicia a pipeline completa de geração automática de vídeo
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId]
 *             properties:
 *               projectId: { type: string, format: uuid }
 *               tema: { type: string }
 *               palavras: { type: array, items: { type: string } }
 *     responses:
 *       202: { description: Pipeline de geração iniciada }
 *       404: { description: Projeto não encontrado }
 */
router.post('/generate', videoController.generate);

/**
 * @swagger
 * /api/videos/{id}/status:
 *   get:
 *     summary: Consulta o status de processamento de um vídeo
 *     tags: [Videos]
 *     responses:
 *       200: { description: Status do vídeo }
 *       404: { description: Vídeo não encontrado }
 */
router.get('/:id/status', videoController.getStatus);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Detalhes de um vídeo específico
 *     tags: [Videos]
 *     responses:
 *       200: { description: Vídeo encontrado }
 *       404: { description: Vídeo não encontrado }
 */
router.get('/:id', videoController.getById);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Remove um vídeo (soft delete)
 *     tags: [Videos]
 *     responses:
 *       200: { description: Vídeo removido }
 *       404: { description: Vídeo não encontrado }
 */
router.delete('/:id', videoController.delete);

module.exports = router;
