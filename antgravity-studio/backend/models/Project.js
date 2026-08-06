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
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
          validate: {
            notNull: { msg: 'O id do usuário é obrigatório.' },
          },
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
          validate: {
            notEmpty: { msg: 'O idioma é obrigatório.' },
          },
        },
        theme: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: 'default',
        },
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
        paranoid: true, // Soft delete
        underscored: true,
        indexes: [
          { fields: ['user_id'] },
          { fields: ['niche'] },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    this.hasMany(models.Video, {
      foreignKey: 'projectId',
      as: 'videos',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

module.exports = Project;
