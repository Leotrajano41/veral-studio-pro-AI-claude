const Video = require('../models/Video');
const Project = require('../models/Project');
const Roteirizador = require('../services/roteirizador');
const TTSService = require('../services/ttsService');
const MediaFinder = require('../services/mediaFinder');
const VideoRenderer = require('../services/videoRenderer');

const roteirizador = new Roteirizador();
const ttsService = new TTSService();
const mediaFinder = new MediaFinder();
const videoRenderer = new VideoRenderer();

/**
 * Controller para operações de Vídeos e pipeline de geração automatizada.
 */
const videoController = {
  /**
   * @route   GET /api/videos
   * @desc    Lista todos os vídeos do usuário autenticado com paginação.
   */
  async list(req, res, next) {
    try {
      const userId = req.userId;
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
      const offset = (page - 1) * limit;

      const { count, rows } = await Video.findAndCountAll({
        include: [{
          model: Project,
          as: 'project',
          where: { userId },
          attributes: ['id', 'name', 'niche'],
        }],
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
  },

  /**
   * @route   GET /api/videos/:id
   * @desc    Retorna detalhes de um vídeo específico.
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const video = await Video.findOne({
        where: { id },
        include: [{
          model: Project,
          as: 'project',
          where: { userId },
        }],
      });

      if (!video) {
        return res.status(404).json({
          success: false,
          error: 'Vídeo não encontrado.',
          code: 'VIDEO_NOT_FOUND',
        });
      }

      return res.status(200).json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @route   POST /api/videos/generate
   * @desc    Inicia a pipeline completa de geração automática de vídeo.
   *          1. Gera roteiro (OpenAI)
   *          2. Sintetiza narração (Google TTS)
   *          3. Busca mídias de apoio (Pixabay/Pexels)
   *          4. Renderiza vídeo final (FFmpeg)
   */
  async generate(req, res, next) {
    try {
      const userId = req.userId;
      const { projectId, tema, palavras } = req.body;

      // 1. Validar o projeto
      if (!projectId) {
        return res.status(400).json({
          success: false,
          error: 'O campo "projectId" é obrigatório.',
          code: 'MISSING_PROJECT_ID',
        });
      }

      const project = await Project.findOne({ where: { id: projectId, userId } });
      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Projeto não encontrado.',
          code: 'PROJECT_NOT_FOUND',
        });
      }

      const temaFinal = tema || project.name;

      // 2. Criar registro de vídeo com status "pending"
      const video = await Video.create({
        projectId: project.id,
        status: 'pending',
        metadata: { tema: temaFinal, palavras: palavras || [] },
      });

      // 3. Responder imediatamente ao cliente (a pipeline roda em background)
      res.status(202).json({
        success: true,
        data: {
          videoId: video.id,
          status: 'pending',
          message: 'Geração de vídeo iniciada. Acompanhe pelo status.',
        },
      });

      // 4. Executar pipeline em background (fire-and-forget com log de erro)
      videoController._executarPipeline(video, project, temaFinal, palavras).catch((err) => {
        console.error(`[VideoController] Pipeline falhou para vídeo ${video.id}:`, err.message);
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Pipeline interna de geração. Executa em background após resposta HTTP 202.
   * @private
   */
  async _executarPipeline(video, project, tema, palavras) {
    try {
      // Atualizar status para "processing"
      await video.update({ status: 'processing' });

      // ── Etapa 1: Gerar Roteiro ──
      console.log(`[Pipeline] Etapa 1/4 – Gerando roteiro para vídeo ${video.id}...`);
      const roteiroResult = await roteirizador.gerarRoteiro(
        tema,
        project.niche,
        project.language || 'pt-BR',
        palavras || []
      );

      if (!roteiroResult.success) {
        throw new Error(`Roteiro: ${roteiroResult.error}`);
      }

      await video.update({ roteiro: roteiroResult.data.roteiro });

      // ── Etapa 2: Sintetizar Narração ──
      console.log(`[Pipeline] Etapa 2/4 – Sintetizando narração para vídeo ${video.id}...`);
      const ttsResult = await ttsService.gerarNaracao(roteiroResult.data.roteiro, {
        idioma: project.language || 'pt-BR',
      });

      if (!ttsResult.success) {
        throw new Error(`TTS: ${ttsResult.error}`);
      }

      await video.update({
        naracao: ttsResult.data.audioPath,
        duracao: ttsResult.data.duracaoEstimadaSec || 0,
      });

      // ── Etapa 3: Buscar Mídias ──
      console.log(`[Pipeline] Etapa 3/4 – Buscando mídias para vídeo ${video.id}...`);
      const mediaResult = await mediaFinder.buscarMidia(tema, 5);

      const videoPaths = [];
      if (mediaResult.success && mediaResult.data && mediaResult.data.length > 0) {
        // Armazenar URLs das mídias nos metadados
        await video.update({
          metadata: {
            ...video.metadata,
            mediasEncontradas: mediaResult.data.map((m) => m.url),
          },
        });
      }

      // ── Etapa 4: Renderizar Vídeo ──
      console.log(`[Pipeline] Etapa 4/4 – Renderizando vídeo ${video.id}...`);
      const renderResult = await videoRenderer.renderizar({
        audioPath: ttsResult.data.audioPath,
        videoPaths,
        config: { width: 1080, height: 1920, fps: 30 },
      });

      if (!renderResult.success) {
        throw new Error(`Render: ${renderResult.error}`);
      }

      // ── Finalizar ──
      await video.update({
        status: 'done',
        videoPath: renderResult.data.outputPath,
      });

      console.log(`[Pipeline] ✅ Vídeo ${video.id} concluído com sucesso!`);
    } catch (error) {
      console.error(`[Pipeline] ❌ Erro no vídeo ${video.id}:`, error.message);
      await video.update({
        status: 'error',
        metadata: { ...(video.metadata || {}), errorMessage: error.message },
      });
    }
  },

  /**
   * @route   GET /api/videos/:id/status
   * @desc    Retorna o status atual do processamento de um vídeo.
   */
  async getStatus(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const video = await Video.findOne({
        where: { id },
        attributes: ['id', 'status', 'duracao', 'videoPath', 'metadata', 'updatedAt'],
        include: [{
          model: Project,
          as: 'project',
          where: { userId },
          attributes: ['id', 'name'],
        }],
      });

      if (!video) {
        return res.status(404).json({
          success: false,
          error: 'Vídeo não encontrado.',
          code: 'VIDEO_NOT_FOUND',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: video.id,
          status: video.status,
          duracao: video.duracao,
          videoPath: video.videoPath,
          updatedAt: video.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @route   DELETE /api/videos/:id
   * @desc    Remove um vídeo (soft delete).
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const video = await Video.findOne({
        where: { id },
        include: [{
          model: Project,
          as: 'project',
          where: { userId },
          attributes: ['id'],
        }],
      });

      if (!video) {
        return res.status(404).json({
          success: false,
          error: 'Vídeo não encontrado.',
          code: 'VIDEO_NOT_FOUND',
        });
      }

      await video.destroy(); // soft delete

      return res.status(200).json({
        success: true,
        data: { message: 'Vídeo removido com sucesso.' },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = videoController;
