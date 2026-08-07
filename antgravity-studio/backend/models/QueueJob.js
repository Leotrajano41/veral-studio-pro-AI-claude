const { DataTypes, Model } = require('sequelize');

class QueueJob extends Model {
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
          allowNull: true,
          field: 'project_id',
          references: { model: 'projects', key: 'id' },
        },
        type: {
          type: DataTypes.ENUM('script', 'narration', 'media', 'render', 'thumbnail', 'publish', 'pipeline'),
          allowNull: false,
          defaultValue: 'pipeline',
        },
        status: {
          type: DataTypes.ENUM('pending', 'running', 'done', 'error', 'cancelled'),
          allowNull: false,
          defaultValue: 'pending',
        },
        progress: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: { min: 0, max: 100 },
        },
        priority: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 5,
          validate: { min: 1, max: 10 },
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        logs: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          defaultValue: [],
        },
        output: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        config: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        startedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'started_at',
        },
        finishedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'finished_at',
        },
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'error_message',
        },
      },
      {
        sequelize,
        modelName: 'QueueJob',
        tableName: 'queue_jobs',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['project_id'] },
          { fields: ['status'] },
          { fields: ['type'] },
          { fields: ['priority'] },
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

module.exports = QueueJob;
