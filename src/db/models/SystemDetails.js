const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SystemDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SystemDetails.belongsTo(models.ErrorException, {
        foreignKey: 'errorExceptionId',
        as: 'ErrorException',
      });
    }
  }
  SystemDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      arch: DataTypes.STRING,
      processor: DataTypes.STRING,
      hostname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform: DataTypes.STRING,
      platformRelease: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platformVersion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      errorExceptionId: DataTypes.INTEGER
    }, {
      sequelize,
      timestamps: false,
      modelName: 'SystemDetails',
      tableName: 'systemDetails',
    },
  );

  return SystemDetails;
};
