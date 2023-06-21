/**
 * Example of a usage of the package storing extra data
 * 
 * To run this example:
 * 1. Transpile the code
 *    npm run build
 * 2. Run the trasnpiled file
 *    node dist/examples/storing_extra_vars.js
 */

import { Logger } from '../src/index';

// Functions to have a deeper stack
const foo = () => {
  throw new Error('Foo Error');
};

const bar = () => {
  foo();
};

const baz = () => {
  bar();
};

// Main function
const main = async () => {
  const logger = new Logger('Storing Extra Vars');

  try {
    logger.addExtra('Extra Section', 'This is a simple string');
    logger.addExtra('Extra Section', 'This will override the previos string');

    baz();

  } catch (err) {
    logger.addExtra('Extra Section Two', {
      errorOcurred: true,
      msg: 'Object stored as an extra',
    });

    await logger.trackError(err);
    const errorTracked = await logger.report();

    console.log('Error tracked.');
    console.log(errorTracked);
  }
};

main();
