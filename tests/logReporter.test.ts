import { expect, describe, test, afterAll, beforeAll } from '@jest/globals';
import { Logger, LogReporter } from '../src/index';
// @ts-ignore
import { Log, LogGroup } from '../src/db/models/index';
import { LogReporterObject } from '../src/types';

describe('Tests for the LogReporter class and its simple logs', () => {
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

  test('should return an array of strings that matches with the expected format', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getBasicLogs();
    const regEx = /\[(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)\s{0,1}\]\[\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}:\d{2}\]:[\w\d\s]*/
    
    expect(logs.every(l => regEx.test(l))).toBe(true);
  });

  afterAll(async () => {
    await Log.destroy({
      where: {
        flow,
      }
    })
  });
});

describe('Tests for the LogReporter class and its complex logs', () => {
  let flow: string;
  let groupName: string;
  let content: string;

  beforeAll(async () => {
    flow = `${Date.now()}`;
    groupName = `${Date.now()}-group`;
    content = `${Date.now()}-content`;

    const logger: Logger = new Logger(flow);
    const group = await logger.getOrCreateGroup(groupName);

    await logger.trace(`${content}-trace`);
    await logger.info(`${content}-info`);
    await logger.debug(`${content}-debug`);
    await logger.warn(`${content}-warn`);
    await logger.error(`${content}-error`);
    await logger.fatal(`${content}-fatal`);
    await logger.warn(`${content}-war2`, { group });
    await logger.error(`${content}-error2`, { group });
    await logger.fatal(`${content}-fatal2`, { group });
  });

  test('should return the total of the stored logs', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getLogs();

    expect(logs.length).toBe(9);
  });

  test('should return a limited amount of logs according to the passed options', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getLogs({
      limit: 3,
    });

    expect(logs.length).toBe(3);
  });

  test('should return an array of LogReporterObject objects', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getLogs();

    const isLogReporterObject = (obj: LogReporterObject): obj is LogReporterObject => {
      return (obj as LogReporterObject).flow !== undefined;
    }

    expect(logs.every(l => isLogReporterObject(l))).toBe(true);
  });

  test('should filter logs objects by a group name', async () => {
    const reporter: LogReporter = new LogReporter(flow);
    const logs = await reporter.getLogs({
      groupName,
    });

    expect(logs.length).toBe(3);
  });

  afterAll(async () => {
    await Log.destroy({
      where: {
        flow,
      }
    });

    await LogGroup.destroy({
      where: {
        name: groupName,
      }
    });
  });
});
