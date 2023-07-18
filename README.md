<p align="center">
  <img width="442" height="90" src="https://github.com/logtracing/node-pkg/assets/55886451/a605b6fd-14c8-4d0d-9cfa-c8f0742aa5ec">
</p>

<p align="center">The <strong>LogTracing</strong> Node.js package is a component of the comprehensive <strong>LogTracing</strong> suite, dedicated to facilitating error tracking and log management across various applications.</p>

<p align="center">
  <img src="https://github.com/logtracing/node-pkg/actions/workflows/node.js.yml/badge.svg">
  <img src="https://img.shields.io/npm/v/@logtracing/node?color=blue">
  <img src="https://img.shields.io/npm/l/@logtracing/node?color=blue">
</p>

## :book: Configuration

### :open_file_folder: Creating your database
Before start using this suite, you need to have a MySQL database ready to be used (locally or on a server) and create the required tables.

You can find the migration SQL file here: [SQL for tables](https://github.com/logtracing/node-pkg/blob/main/database.sql)

### :wrench: Initial configuration
Install the package:
```bash
npm i @logtracing/node
```

Create a `.env` file and add the following properties with your own information, replace `[ENV]` with your environment (`DEV`, `TEST`, or `PROD`):
```properties
MYSQL_USERNAME_[ENV]=
MYSQL_PASSWORD_[ENV]=
MYSQL_DATABASE_[ENV]=
MYSQL_HOST_[ENV]=
MYSQL_PORT_[ENV]=
```

Load your `.env` file using the [dotenv module](https://www.npmjs.com/package/dotenv) at the very beginning of your code (before other code runs):
```js
require('dotenv').config();

// or
import 'dotenv/config';
```

Import it in your code:
```js
const { ExceptionLogger } = require('@logtracing/node');

// or
import { ExceptionLogger } from '@logtracing/node';
```

## :rocket: Usage
### `Logger`
You can write your own logs using the `Logger` class:
```js
const { Logger } = require('@logtracing/node');

const myLogger = new Logger('MY APP LOGGER');

const trace = await logger.trace('Example of a trace log message');
const debug = await logger.debug('Example of a debug log message');
const info = await logger.info('Example of an info log message');
const warn = await logger.warn('Example of a warn log message');
const error = await logger.error('Example of an error log message');
const fatal = await logger.fatal('Example of a fatal log message');
```

### `ExceptionLogger`
You can also track the exceptions in your code, to have a big picture of what happened when your application fails. Start tracking your errors:
```js
const exLogger = new ExceptionLogger('MY APP EXCEPTION LOGGER');

const user = {
  username: 'admin',
  email: 'email@admin.com'
};

const foo = (): void => {
  throw new Error('Foo Error');
};

const bar = (): void => {
  foo();
};

// You can add extra information that could be useful to understand the error
exLogger.addExtra('User information', {
  user: user,
});

try {
  bar();
} catch (err) {
  exLogger.addExtra('More information', 'Handled Error Message');

  // Start to track the error
  exLogger.trackError(err).then(() => {
  
    // When finish, call report() to send all the information to your DB
    log.report();
  });
}
```

:zap: **After doing this, you'll have in your configured database all the information related to the error that you tracked.**

❕You'll find more examples in [this folder](https://github.com/logtracing/node-pkg/blob/main/examples).

## :arrow_down: Installation for development purposes
### Getting the code
Clone this project:
```bash
git clone git@github.com:logtracing/node-pkg.git

# I recommend you change the name of the folder in your machine
git clone git@github.com:logtracing/node-pkg.git logtracing-nodejs
```

Install dependencies:
```bash
cd logtracing-nodejs && npm install
```

Create a `.env` file and fill it with the missing information:
```bash
cp .env.example .env
```

Transpile TS files into JS files:
```bash
npm run build
```

Run the tests:
```bash
npm run test
```

### Configuring MySQL
This project uses `mysql` as a database provider, so it is important to have a database before start making changes.

We have a `docker-compose.yml` file that provides you with a database ready to use, you just need to execute:
```bash
docker compose up
```

Then, when the container is up, you can execute the migrations by running:
```bash
npm run db:migrate
```

## :scroll: Licence
[MIT](https://github.com/logtracing/node-pkg/blob/main/LICENSE)
