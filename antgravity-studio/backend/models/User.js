const { DataTypes, Model } = require('sequelize');

class User extends Model {
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
            notEmpty: { msg: 'O nome não pode estar vazio.' },
            len: { args: [2, 255], msg: 'O nome deve ter entre 2 e 255 caracteres.' },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: { msg: 'Este e-mail já está cadastrado.' },
          validate: {
            isEmail: { msg: 'Forneça um endereço de e-mail válido.' },
            notEmpty: { msg: 'O e-mail é obrigatório.' },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'A senha é obrigatória.' },
            len: { args: [6, 255], msg: 'A senha deve ter no mínimo 6 caracteres.' },
          },
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true, // Soft delete (deletedAt)
        underscored: true,
        indexes: [
          { fields: ['email'], unique: true },
          { fields: ['is_active'] },
        ],
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Project, {
      foreignKey: 'userId',
      as: 'projects',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

module.exports = User;
