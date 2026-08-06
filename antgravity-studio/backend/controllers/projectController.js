const Project = require('../models/Project');
const Video = require('../models/Video');

/**
 * Controller para operações CRUD de Projetos.
 */
const projectController = {
  /**
   * @route   GET /api/projects
   * @desc    Lista todos os projetos do usuário autenticado com paginação.
   */
  async list(req, res, next) {
    try {
      const userId = req.userId;
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
      const offset = (page - 1) * limit;

      const { count, rows } = await Project.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: Video, as: 'videos', attributes: ['id', 'status'] }],
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
  },

  /**
   * @route   GET /api/projects/:id
   * @desc    Retorna detalhes de um projeto específico.
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const project = await Project.findOne({
        where: { id, userId },
        include: [{ model: Video, as: 'videos' }],
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Projeto não encontrado.',
          code: 'PROJECT_NOT_FOUND',
        });
      }

      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @route   POST /api/projects
   * @desc    Cria um novo projeto.
   */
  async create(req, res, next) {
    try {
      const userId = req.userId;
      const { name, niche, language, theme, config } = req.body;

      if (!name || !niche) {
        return res.status(400).json({
          success: false,
          error: 'Os campos "name" e "niche" são obrigatórios.',
          code: 'MISSING_FIELDS',
        });
      }

      const project = await Project.create({
        userId,
        name,
        niche,
        language: language || 'pt-BR',
        theme: theme || 'default',
        config: config || {},
      });

      return res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @route   PUT /api/projects/:id
   * @desc    Atualiza um projeto existente.
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const { name, niche, language, theme, config } = req.body;

      const project = await Project.findOne({ where: { id, userId } });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Projeto não encontrado.',
          code: 'PROJECT_NOT_FOUND',
        });
      }

      if (name !== undefined) project.name = name;
      if (niche !== undefined) project.niche = niche;
      if (language !== undefined) project.language = language;
      if (theme !== undefined) project.theme = theme;
      if (config !== undefined) project.config = config;

      await project.save();

      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @route   DELETE /api/projects/:id
   * @desc    Remove um projeto (soft delete).
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const project = await Project.findOne({ where: { id, userId } });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Projeto não encontrado.',
          code: 'PROJECT_NOT_FOUND',
        });
      }

      await project.destroy(); // soft delete (paranoid)

      return res.status(200).json({
        success: true,
        data: { message: 'Projeto removido com sucesso.' },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = projectController;
