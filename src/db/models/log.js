const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Log.belongsTo(models.LogGroupModel, {
        foreignKey: 'logGroupId',
        as: 'LogGroup',
      });
    }
  }
  Log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      level: {
        type: DataTypes.ENUM,
        values: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'],
      },
      flow: DataTypes.STRING,
      content: DataTypes.TEXT,
      logGroupId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Log',
      tableName: 'logs',
    },
  );

  return Log;
};
