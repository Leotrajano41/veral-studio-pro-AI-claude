const { DataTypes, Model } = require('sequelize');

class Voice extends Model {
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
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: { msg: 'O nome da voz é obrigatório.' },
          },
        },
        provider: {
          type: DataTypes.ENUM('google', 'openai', 'xtts', 'elevenlabs', 'custom'),
          allowNull: false,
          defaultValue: 'google',
        },
        language: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: 'pt-BR',
        },
        gender: {
          type: DataTypes.ENUM('male', 'female', 'neutral'),
          allowNull: true,
          defaultValue: 'neutral',
        },
        style: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        sampleUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'sample_url',
        },
        voiceId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'voice_id',
          comment: 'ID da voz no provedor (ex: pt-BR-Standard-A no Google TTS)',
        },
        config: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_default',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        isCloned: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_cloned',
          comment: 'True se for voz clonada pelo usuário (XTTS)',
        },
      },
      {
        sequelize,
        modelName: 'Voice',
        tableName: 'voices',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['provider'] },
          { fields: ['language'] },
          { fields: ['is_default'] },
        ],
      }
    );
  }

  static associate(_models) {
    // Sem associações por agora — vozes são globais
  }
}

module.exports = Voice;
