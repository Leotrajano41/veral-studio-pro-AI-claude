const { DataTypes, Model } = require('sequelize');

class Project extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'O nome do projeto não pode estar vazio.' },
            len: { args: [2, 255], msg: 'O nome deve ter entre 2 e 255 caracteres.' },
          },
        },
        niche: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: { msg: 'O nicho do projeto é obrigatório.' },
          },
        },
        language: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: 'pt-BR',
        },
        status: {
          type: DataTypes.ENUM('draft', 'in_progress', 'review', 'done', 'published', 'archived'),
          allowNull: false,
          defaultValue: 'draft',
        },
        // Conteúdo
        topic: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: 'Tema principal do vídeo',
        },
        keywords: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          defaultValue: [],
        },
        tone: {
          type: DataTypes.ENUM('professional', 'casual', 'dramatic', 'educational', 'funny', 'emotional', 'inspiring'),
          allowNull: true,
          defaultValue: 'professional',
        },
        targetAudience: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'target_audience',
        },
        // Produção de Vídeo
        duration: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 60,
          comment: 'Duração em segundos',
        },
        fps: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 30,
        },
        resolution: {
          type: DataTypes.ENUM('720p', '1080p', '4K', '1080x1920', '1080x1080'),
          allowNull: true,
          defaultValue: '1080p',
        },
        format: {
          type: DataTypes.ENUM('landscape', 'portrait', 'square'),
          allowNull: true,
          defaultValue: 'landscape',
        },
        // Narração / Voz
        voiceId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'voice_id',
          references: { model: 'voices', key: 'id' },
        },
        voiceSpeed: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 1.0,
          field: 'voice_speed',
        },
        voicePitch: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
          field: 'voice_pitch',
        },
        // Estilo Visual
        thumbnailStyle: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'thumbnail_style',
          defaultValue: 'modern',
        },
        subtitleStyle: {
          type: DataTypes.ENUM('none', 'bottom', 'center', 'karaoke', 'viral'),
          allowNull: true,
          field: 'subtitle_style',
          defaultValue: 'bottom',
        },
        bgColor: {
          type: DataTypes.STRING(7),
          allowNull: true,
          field: 'bg_color',
          defaultValue: '#000000',
        },
        musicGenre: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'music_genre',
          defaultValue: 'cinematic',
        },
        musicVolume: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'music_volume',
          defaultValue: 20,
          validate: { min: 0, max: 100 },
        },
        watermark: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: 'URL ou texto do watermark',
        },
        // Publicação
        ctaText: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'cta_text',
        },
        youtubeTags: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          field: 'youtube_tags',
          defaultValue: [],
        },
        youtubeTitle: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'youtube_title',
        },
        youtubeDescription: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'youtube_description',
        },
        channelId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'channel_id',
        },
        scheduledAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'scheduled_at',
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'published_at',
        },
        autoPublish: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'auto_publish',
        },
        // Pipeline
        pipelineStep: {
          type: DataTypes.ENUM('idle', 'script', 'narration', 'media', 'render', 'thumbnail', 'review', 'publish'),
          allowNull: false,
          defaultValue: 'idle',
          field: 'pipeline_step',
        },
        // Métricas
        viewsCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          field: 'views_count',
        },
        // Assets gerados
        scriptContent: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'script_content',
        },
        narrationUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'narration_url',
        },
        thumbnailUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'thumbnail_url',
        },
        outputVideoUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'output_video_url',
        },
        // Config extra (JSONB para flexibilidade)
        config: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: 'Project',
        tableName: 'projects',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['niche'] },
          { fields: ['status'] },
          { fields: ['pipeline_step'] },
        ],
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Video, {
      foreignKey: 'projectId',
      as: 'videos',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    this.hasMany(models.QueueJob, {
      foreignKey: 'projectId',
      as: 'queueJobs',
    });

    this.belongsTo(models.Voice, {
      foreignKey: 'voiceId',
      as: 'voice',
    });
  }
}

module.exports = Project;
