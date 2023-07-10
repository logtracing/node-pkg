'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.ENUM('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'),
        defaultValue: 'INFO',
      },
      flow: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
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
    await queryInterface.dropTable('logs');
  }
};
