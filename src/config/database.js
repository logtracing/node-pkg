require('dotenv').config();

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
    username: process.env.MYSQL_USERNAME_TEST,
    password: process.env.MYSQL_PASSWORD_TEST,
    database: process.env.MYSQL_DATABASE_TEST,
    host: process.env.MYSQL_HOST_TEST,
    port: process.env.MYSQL_PORT_TEST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQL_USERNAME_PROD,
    password: process.env.MYSQL_PASSWORD_PROD,
    database: process.env.MYSQL_DATABASE_PROD,
    host: process.env.MYSQL_HOST_PROD,
    port: process.env.MYSQL_PORT_PROD,
    dialect: 'mysql',
  },
};
