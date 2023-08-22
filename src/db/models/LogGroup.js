const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LogGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LogGroup.hasMany(models.LogModel, {
        as: 'Logs',
      });

      LogGroup.hasMany(models.ErrorExceptionModel, {
        as: 'ErrorExceptions',
      });
    }
  }
  LogGroup.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'LogGroup',
      tableName: 'logGroups',
    }
  );

  return LogGroup;
};
