const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExecutionDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExecutionDetails.hasMany(models.ExecutionArgumentsModel, {
        as: 'ExecutionArguments',
      });
      
      ExecutionDetails.belongsTo(models.ErrorExceptionModel, {
        foreignKey: 'errorExceptionId',
        as: 'ErrorException',
      });
    }
  }
  ExecutionDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language: DataTypes.STRING,
      version: DataTypes.STRING,
      executionFinishTime: DataTypes.DATE,
      errorExceptionId: DataTypes.INTEGER
    }, {
      sequelize,
      timestamps: false,
      modelName: 'ExecutionDetails',
      tableName: 'executionDetails',
    },
  );

  return ExecutionDetails;
};
