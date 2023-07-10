const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stack.hasMany(models.CodeLine, {
        as: 'CodeLines',
      });

      Stack.belongsTo(models.ErrorException, {
        foreignKey: 'errorExceptionId',
        as: 'ErrorException',
      });
    }
  }
  Stack.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file: DataTypes.STRING,
      function: DataTypes.STRING,
      line: DataTypes.NUMBER,
      column: DataTypes.NUMBER,
      errorExceptionId: DataTypes.NUMBER
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Stack',
      tableName: 'stack',
    },
  );

  return Stack;
};
