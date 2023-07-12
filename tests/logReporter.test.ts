import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';
import { Logger, LogReporter } from '../src/index';
// @ts-ignore
import { Log } from '../src/db/models/index';

describe('Tests for the LogReporter and its simple logs', () => {
  let flow: string;
  let groupName: string;
  let content: string;

  beforeAll(async () => {
    flow = `${Date.now()}`;
    groupName = `${Date.now()}-group`;
    content = `${Date.now()}-content`;

    const logger: Logger = new Logger(flow);

    await logger.trace(`${content}-trace`);
    await logger.info(`${content}-info`);
    await logger.debug(`${content}-debug`);
    await logger.warn(`${content}-warn`);
    await logger.error(`${content}-error`);
    await logger.fatal(`${content}-fatal`);
    await logger.warn(`${content}-war2`);
    await logger.error(`${content}-error2`);
    await logger.fatal(`${content}-fatal2`);
  });

  test('should return the total of the stored logs', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getBasicLogs();

    expect(logs.length).toBe(9);
  });

  test('should return a limited amount of logs according to the passed options', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getBasicLogs({
      limit: 3,
    });

    expect(logs.length).toBe(3);
  });

  test('should return an array of strings', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getBasicLogs();
    
    expect(logs.every(l => typeof(l) === 'string')).toBe(true);
  });

  afterAll(async () => {
    await Log.destroy({
      where: {
        flow,
      }
    })
  });
});

