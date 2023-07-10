'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('systemDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      arch: {
        type: Sequelize.STRING
      },
      processor: {
        type: Sequelize.STRING
      },
      hostname: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },
      platformRelease: {
        type: Sequelize.STRING
      },
      platformVersion: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('systemDetails');
  }
};
