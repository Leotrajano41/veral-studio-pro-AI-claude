const { DataTypes, Model } = require('sequelize');

class UserConfig extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        serial: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          defaultValue: 'AG-2026-PRO-7X4K',
        },
        apiOpenai: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_openai',
        },
        apiAssembly: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_assembly',
        },
        apiPixabay: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_pixabay',
        },
        apiPexels: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_pexels',
        },
        apiGoogleCloud: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_google_cloud',
        },
        apiOpenrouter: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_openrouter',
        },
        apiYoutube: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'api_youtube',
        },
        pastaMusicaFundo: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'pasta_musica_fundo',
        },
        pastaDestino: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'pasta_destino',
        },
        pastaVideosCustom: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'pasta_videos_custom',
        },
        // Preferências gerais
        defaultLanguage: {
          type: DataTypes.STRING(10),
          allowNull: true,
          defaultValue: 'pt-BR',
          field: 'default_language',
        },
        defaultVoiceProvider: {
          type: DataTypes.STRING(50),
          allowNull: true,
          defaultValue: 'google',
          field: 'default_voice_provider',
        },
        defaultResolution: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: '1080p',
          field: 'default_resolution',
        },
        defaultFps: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 30,
          field: 'default_fps',
        },
        maxParallelJobs: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 2,
          field: 'max_parallel_jobs',
        },
        theme: {
          type: DataTypes.ENUM('dark', 'light'),
          allowNull: true,
          defaultValue: 'dark',
        },
      },
      {
        sequelize,
        modelName: 'UserConfig',
        tableName: 'user_config',
        timestamps: true,
        underscored: true,
        indexes: [{ fields: ['serial'], unique: true }],
      }
    );
  }

  static associate(_models) {}
}

module.exports = UserConfig;
