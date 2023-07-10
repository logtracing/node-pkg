'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('errorExceptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      package: {
        type: Sequelize.STRING
      },
      flow: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      stackStr: {
        type: Sequelize.TEXT,
      },
      logGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'logGroups',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('errorExceptions');
  }
};
