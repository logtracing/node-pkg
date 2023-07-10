const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CodeLine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CodeLine.belongsTo(models.Stack, {
        foreignKey: 'stackId',
        as: 'Stack',
      });
    }
  }
  CodeLine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      line: DataTypes.INTEGER,
      content: DataTypes.STRING,
      isErrorLine: DataTypes.BOOLEAN,
      stackId: DataTypes.NUMBER,
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'CodeLine',
      tableName: 'codeLines',
    },
  );

  return CodeLine;
};
