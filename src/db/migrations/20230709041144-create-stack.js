/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stack', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      file: {
        type: Sequelize.STRING
      },
      function: {
        type: Sequelize.STRING
      },
      line: {
        type: Sequelize.INTEGER,
      },
      column: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('stack');
  }
};
