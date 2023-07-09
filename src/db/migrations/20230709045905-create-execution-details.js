/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('executionDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      language: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      executionFinishTime: {
        type: Sequelize.DATE,
      },
      errorExceptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'errorExceptions',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('executionDetails');
  }
};
