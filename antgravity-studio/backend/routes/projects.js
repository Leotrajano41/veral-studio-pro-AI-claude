const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gerenciamento de projetos de vídeo
 */

// Todas as rotas de projetos exigem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Lista todos os projetos do usuário
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada de projetos }
 */
router.get('/', projectController.list);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Detalhes de um projeto
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Projeto encontrado }
 *       404: { description: Projeto não encontrado }
 */
router.get('/:id', projectController.getById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, niche]
 *             properties:
 *               name: { type: string }
 *               niche: { type: string }
 *               language: { type: string, default: 'pt-BR' }
 *               theme: { type: string, default: 'default' }
 *               config: { type: object }
 *     responses:
 *       201: { description: Projeto criado com sucesso }
 */
router.post('/', projectController.create);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Atualiza um projeto existente
 *     tags: [Projects]
 *     responses:
 *       200: { description: Projeto atualizado }
 *       404: { description: Projeto não encontrado }
 */
router.put('/:id', projectController.update);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Remove um projeto (soft delete)
 *     tags: [Projects]
 *     responses:
 *       200: { description: Projeto removido }
 *       404: { description: Projeto não encontrado }
 */
router.delete('/:id', projectController.delete);

module.exports = router;
