/**
 * Example of a basic usage of the package
 * 
 * To run this example:
 * 1. Transpile the code
 *    npm run build
 * 2. Run the trasnpiled file
 *    node dist/examples/basic_usage.js
 */

import { ExceptionLogger } from '../src/index';

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
  const logger = new ExceptionLogger('Basic Usage');

  try {
    baz();
  } catch (err) {
    await logger.trackError(err);
    const errorTracked = await logger.report();

    console.log('Error tracked.');
    console.log(errorTracked);
  }
};

main();
