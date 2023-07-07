/**
 * Example of a basic usage of other kind of logs
 * 
 * To run this example:
 * 1. Transpile the code
 *    npm run build
 * 2. Run the trasnpiled file
 *    node dist/examples/logs_basic_usage.js
 */

import { Logger } from '../src/index';


// Main function
const main = async () => {
  const logger = new Logger('More Logs Usage');

  const trace = await logger.debug('This is a trace log');
  const debug = await logger.debug('This is a debug log');
  const info = await logger.info('This is an info log');
  const warning = await logger.warn('This is a warning log');
  const error = await logger.error('This is an error log');
  const fatal = await logger.error('This is a fatal log');

  console.log(trace);
  console.log(debug);
  console.log(info);
  console.log(warning);
  console.log(error);
  console.log(fatal);
};

main();
