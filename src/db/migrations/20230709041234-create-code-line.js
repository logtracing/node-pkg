/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('codeLines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      line: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      isErrorLine: {
        type: Sequelize.BOOLEAN
      },
      stackId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'stack',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('codeLines');
  }
};
