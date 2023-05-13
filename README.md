<p align="center">
  <img width="442" height="90" src="https://github.com/logtracing/node-pkg/assets/55886451/a605b6fd-14c8-4d0d-9cfa-c8f0742aa5ec">
</p>

<p align="center">Package to track exceptions in applications made with NodeJS.</p>

<p align="center">
  <img src="https://github.com/logtracing/node-pkg/actions/workflows/node.js.yml/badge.svg">
  <img src="https://img.shields.io/npm/v/@logtracing/node?color=blue">
  <img src="https://img.shields.io/npm/l/@logtracing/node?color=blue">
</p>

## :rocket: Usage (docs in progress :construction:)
Install the package:
```bash
npm i @logtracing/node
```

Import it in your code:
```js
const Logger = require('@logtracing/node');

// or

import Logger = from '@logtracing/node';
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
  log.addExtra('More information', {
    currentStatus: 309,
  });

  // Start to track the error
  log.trackError(err).then(() => {
  
    // When finish, call report() to send all the information to your DB
    log.report();
  });
}
```

## :arrow_down: Installation (for development)
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
