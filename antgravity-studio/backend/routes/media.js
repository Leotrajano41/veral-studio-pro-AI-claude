const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const MediaFinder = require('../services/mediaFinder');
const MediaCache = require('../models/MediaCache');

const mediaFinder = new MediaFinder();

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Busca e cache de mídias externas (Pixabay/Pexels)
 */

// Todas as rotas de mídia exigem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /api/media/search:
 *   get:
 *     summary: Busca mídias externas por termo (combina Pixabay e Pexels)
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Termo de pesquisa
 *       - in: query
 *         name: quantidade
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista de mídias encontradas }
 *       400: { description: Parâmetro de busca ausente }
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, quantidade } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'O parâmetro de busca "q" é obrigatório.',
        code: 'MISSING_QUERY',
      });
    }

    const qtd = parseInt(quantidade, 10) || 10;
    const result = await mediaFinder.buscarMidia(q, qtd);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/media/cache:
 *   post:
 *     summary: Salva uma entrada de mídia no cache
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [termo, fonte, url]
 *             properties:
 *               termo: { type: string }
 *               fonte: { type: string }
 *               url: { type: string }
 *               thumbnail: { type: string }
 *     responses:
 *       201: { description: Cache salvo com sucesso }
 */
router.post('/cache', async (req, res, next) => {
  try {
    const { termo, fonte, url, thumbnail } = req.body;

    if (!termo || !fonte || !url) {
      return res.status(400).json({
        success: false,
        error: 'Os campos "termo", "fonte" e "url" são obrigatórios.',
        code: 'MISSING_FIELDS',
      });
    }

    const cached = await MediaCache.create({
      termo: termo.trim().toLowerCase(),
      fonte,
      url,
      thumbnail: thumbnail || null,
    });

    return res.status(201).json({ success: true, data: cached });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/media/cache:
 *   get:
 *     summary: Lista entradas do cache de mídia
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Lista paginada de cache }
 */
router.get('/cache', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await MediaCache.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
