const { DataTypes, Model } = require('sequelize');

class ApiKey extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        service: {
          type: DataTypes.ENUM(
            'openai',
            'assemblyai',
            'pixabay',
            'pexels',
            'google_cloud',
            'openrouter',
            'youtube',
            'meta_ai',
            'kie_ai',
            'elevenlabs'
          ),
          allowNull: false,
        },
        keyValue: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'key_value',
          comment: 'Chave de API — considere criptografar em produção',
        },
        label: {
          type: DataTypes.STRING(100),
          allowNull: true,
          comment: 'Nome amigável para identificação',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        status: {
          type: DataTypes.ENUM('untested', 'connected', 'error'),
          allowNull: false,
          defaultValue: 'untested',
        },
        lastTestedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_tested_at',
        },
        lastErrorMsg: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'last_error_msg',
        },
        config: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
          comment: 'Configurações extras (ex: model padrão para OpenAI)',
        },
      },
      {
        sequelize,
        modelName: 'ApiKey',
        tableName: 'api_keys',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['service'] },
          { fields: ['is_active'] },
        ],
      }
    );
  }

  static associate(_models) {
    // Multiusuário pode adicionar userId depois
  }
}

module.exports = ApiKey;
