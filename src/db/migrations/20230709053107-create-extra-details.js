/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('extraDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
      isJson: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('extraDetails');
  }
};
