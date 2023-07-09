/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('executionArguments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      argument: {
        type: Sequelize.STRING
      },
      executionDetailsId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'executionDetails',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('executionArguments');
  }
};
