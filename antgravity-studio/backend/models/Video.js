const { DataTypes, Model } = require('sequelize');

class Video extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        projectId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'project_id',
          references: {
            model: 'projects',
            key: 'id',
          },
          validate: {
            notNull: { msg: 'O id do projeto é obrigatório.' },
          },
        },
        status: {
          type: DataTypes.ENUM('pending', 'processing', 'done', 'error'),
          allowNull: false,
          defaultValue: 'pending',
          validate: {
            isIn: {
              args: [['pending', 'processing', 'done', 'error']],
              msg: 'Status inválido. Use: pending, processing, done ou error.',
            },
          },
        },
        roteiro: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        naracao: {
          type: DataTypes.STRING(512),
          allowNull: true,
        },
        duracao: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: 'A duração não pode ser negativa.' },
          },
        },
        videoPath: {
          type: DataTypes.STRING(512),
          allowNull: true,
          field: 'video_path',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: 'Video',
        tableName: 'videos',
        timestamps: true,
        paranoid: true, // Soft delete
        underscored: true,
        indexes: [
          { fields: ['project_id'] },
          { fields: ['status'] },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  }
}

module.exports = Video;
