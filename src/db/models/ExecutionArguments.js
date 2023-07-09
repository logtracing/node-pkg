const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExecutionArguments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExecutionArguments.belongsTo(models.ExecutionDetails, {
        foreignKey: 'executionDetailsId',
        as: 'ExecutionDetails',
      });
    }
  }
  ExecutionArguments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      argument: DataTypes.STRING,
      executionDetailsId: DataTypes.INTEGER
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'ExecutionArguments',
      tableName: 'executionArguments',
    },
  );
  return ExecutionArguments;
};
