/**
 * Example of a basic usage of the package
 * 
 * To run this example:
 * 1. Transpile the code
 *    npm run build
 * 2. Run the trasnpiled file
 *    node dist/examples/basic_usage.js
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
  const logger = new Logger('Basic Usage');

  try {
    baz();
  } catch (err) {
    logger.trackError(err)
      .then(() => logger.report())
      .then((errTracked) => {
        console.log('Error tracked.');
        console.log(errTracked);
      })
      .catch((e) => console.error(e));
  }
};

main();
