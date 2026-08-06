const { DataTypes, Model } = require('sequelize');

class MediaCache extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        termo: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'O termo de busca é obrigatório.' },
          },
        },
        fonte: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: { msg: 'A fonte da mídia é obrigatória (ex: pixabay, pexels).' },
          },
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            isUrl: { msg: 'Forneça uma URL válida para a mídia.' },
          },
        },
        thumbnail: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: 'MediaCache',
        tableName: 'media_cache',
        timestamps: true,
        updatedAt: 'updatedAt',
        createdAt: 'createdAt',
        underscored: true,
        indexes: [
          { fields: ['termo', 'fonte'] },
          { fields: ['created_at'] },
        ],
      }
    );
  }
}

module.exports = MediaCache;
