const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ErrorException extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ErrorException.belongsTo(models.LogGroup, {
        foreignKey: 'logGroupId',
        as: 'LogGroup',
      });

      ErrorException.hasMany(models.Stack, {
        as: 'Stack',
      });

      ErrorException.hasOne(models.SystemDetails, {
        as: 'SystemDetails',
      });

      ErrorException.hasOne(models.ExecutionDetails, {
        as: 'ExecutionDetails',
      });

      ErrorException.hasMany(models.EnvironmentDetails, {
        as: 'EnvironmentDetails',
      });
    }
  }
  ErrorException.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      package: DataTypes.STRING,
      flow: DataTypes.STRING,
      name: DataTypes.STRING,
      message: DataTypes.STRING,
      stackStr: DataTypes.TEXT,
      logGroupId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'ErrorException',
      tableName: 'errorExceptions',
    },
  );

  return ErrorException;
};
