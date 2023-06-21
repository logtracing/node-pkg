/**
 * Example of a usage of the package grouping erorrs
 * 
 * To run this example:
 * 1. Transpile the code
 *    npm run build
 * 2. Run the trasnpiled file
 *    node dist/examples/grouping_errors.js
 */

import { group } from 'console';
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
  const logger = new Logger('Grouping Errors');

  try {
    baz();
  } catch (err) {
    await logger.trackError(err);
    const errorTracked = await logger.report({
      group: (await logger.getOrCreateGroup('Dashboard Errors One'))!
    });

    console.log('Error tracked.');
    console.log(errorTracked);
  }
};

main();
