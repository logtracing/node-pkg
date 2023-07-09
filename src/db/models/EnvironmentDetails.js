const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EnvironmentDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EnvironmentDetails.belongsTo(models.ErrorException, {
        foreignKey: 'errorExceptionId',
        as: 'ErrorException',
      });
    }
  }
  EnvironmentDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      value: DataTypes.TEXT,
      errorExceptionId: DataTypes.INTEGER
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'EnvironmentDetails',
      tableName: 'environmentDetails',
    },
  );

  return EnvironmentDetails;
};
