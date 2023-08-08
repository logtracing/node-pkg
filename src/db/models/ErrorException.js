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
      ErrorException.belongsTo(models.LogGroupModel, {
        foreignKey: 'logGroupId',
        as: 'LogGroup',
      });

      ErrorException.hasMany(models.StackModel, {
        as: 'Stack',
      });

      ErrorException.hasOne(models.SystemDetailsModel, {
        as: 'SystemDetails',
      });

      ErrorException.hasOne(models.ExecutionDetailsModel, {
        as: 'ExecutionDetails',
      });

      ErrorException.hasMany(models.EnvironmentDetailsModel, {
        as: 'EnvironmentDetails',
      });

      ErrorException.hasMany(models.ExtraDetailsModel, {
        as: 'ExtraDetails',
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
