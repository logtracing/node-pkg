const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExtraDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExtraDetails.belongsTo(models.ErrorExceptionModel, {
        foreignKey: 'errorExceptionId',
        as: 'ErrorException',
      });
    }
  }
  ExtraDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      value: DataTypes.STRING,
      isJson: DataTypes.BOOLEAN,
      errorExceptionId: DataTypes.INTEGER
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'ExtraDetails',
      tableName: 'extraDetails',
    },
  );
  return ExtraDetails;
};
