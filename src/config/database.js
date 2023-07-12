require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME_DEV,
    password: process.env.MYSQL_PASSWORD_DEV,
    database: process.env.MYSQL_DATABASE_DEV,
    host: process.env.MYSQL_HOST_DEV,
    port: process.env.MYSQL_PORT_DEV,
    dialect: 'mysql',
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(process.env.PWD, 'test_database.db'),
    logging: false,
  },
  production: {
    username: process.env.MYSQL_USERNAME_PROD,
    password: process.env.MYSQL_PASSWORD_PROD,
    database: process.env.MYSQL_DATABASE_PROD,
    host: process.env.MYSQL_HOST_PROD,
    port: process.env.MYSQL_PORT_PROD,
    dialect: 'mysql',
    logging: false,
  },
};
