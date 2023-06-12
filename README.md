<p align="center">
  <img width="442" height="90" src="https://github.com/logtracing/node-pkg/assets/55886451/a605b6fd-14c8-4d0d-9cfa-c8f0742aa5ec">
</p>

<p align="center">Suite to manage and track errors in your application using your own resources.</p>

<p align="center">
  <img src="https://github.com/logtracing/node-pkg/actions/workflows/node.js.yml/badge.svg">
  <img src="https://img.shields.io/npm/v/@logtracing/node?color=blue">
  <img src="https://img.shields.io/npm/l/@logtracing/node?color=blue">
</p>

## Overview
**Logtracing** is a suite that allows you to track errors that ocurr in your applications. It also allows you to have a full control of how and where to store all the collected information, this means that you need to have your own database where all the information will be stored.

Also, **Logtracing** provides an dashboard to monitoring your errors, but you can use or create your own monitoring dashboard.

Right now is available for the following tech stacks:
- JavaScript (NodeJS)
- Python (In Progress)

**What information does this suite track?**
- Error Stack
- Code lines of each function
- Environment variables
- SO Information

## :wrench: Configuration

### :open_file_folder: Creating your database
Before start using this suite, you need to have a MySQL database ready to be used (locally or in a server) and create the required tables.

You can find the migration SQL file here: [SQL for tables](https://github.com/logtracing/node-pkg/blob/main/prisma/migrations/20230612154657_init/migration.sql)

### :rocket: Usage
Install the package:
```bash
npm i @logtracing/node
```

Create a `.env` file and add the `DATABASE_URL` value and replace the required information:
```properties
# MySQL
DATABASE_URL='mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<YOUR_DATABASE>'
```
---
**IMPORTANT**

Since this package uses [prisma](https://www.prisma.io/) as an ORM, before starting to work, you need to create a prisma client. Simply execute the following command:
```bash
npx prisma generate --schema=./node_modules/@logtracing/node/prisma/schema.prisma
```
---

Load your `.env` file using the [dotenv module](https://www.npmjs.com/package/dotenv) at the very beginning of your code (before other code runs):
```js
require('dotenv').config();

// or

import 'dotenv/config';
```

Import it in your code:
```js
const { Logger } = require('@logtracing/node');

// or

import { Logger } from '@logtracing/node';
```

Start tracking your errors:
```js
// Create an instance of Logger with the name or your current flow
const log = new Logger('Example flow');

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
log.addExtra('User information', {
  user: user,
});

try {
  bar();
} catch (err) {
  log.addExtra('More information', 'Handled Error Message');

  // Start to track the error
  log.trackError(err).then(() => {
  
    // When finish, call report() to send all the information to your DB
    log.report();
  });
}
```

:zap: **After doing this, you'll have in your configured database all the information related with the error that you tracked.**

## :arrow_down: Installation for development purposes
### Configuring MySQL
This project uses `mysql` as a database provider, so it is important to have a database before start making changes.

We have a `docker-compose.yml` file that provides you a database ready to use, you just need to execute:
```bash
docker compose up
```

Then, when the container is up, you can execute the migrations by running:
```bash
npm run migrate:dev
```

### Getting the code
Clone this project:
```bash
git clone git@github.com:logtracing/node-pkg.git

# I recommend you change the name of the folder in your machine
git clone git@github.com:logtracing/node-pkg.git logtracing-nodejs
```

Install depencies:
```bash
cd logtracing-nodejs && npm install
```

Creating a `.env` file and fill it with the missing information:
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

## :scroll: Licence
[MIT](https://github.com/logtracing/node-pkg/blob/main/LICENSE)
