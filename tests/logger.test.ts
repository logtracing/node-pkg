import { expect, describe, test, afterEach, beforeEach } from '@jest/globals';
import { Logger, LogType } from '../src/index';
// @ts-ignore
import { LogModel } from '../src/db/models/index';

describe('Tests for the Logger class', () => {
  let flow: string;
  let group: string;
  let content: string;

  beforeEach(() => {
    flow = `${Date.now()}`;
    group = `${Date.now()}-group`;
    content = `${Date.now()}-content`;
  });

  test('should write a trace log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.trace(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.TRACE);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  test('should write a debug log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.debug(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.DEBUG);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  test('should write an info log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.info(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.INFO);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  test('should write a warn log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.warn(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.WARN);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  test('should write an error log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.error(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.ERROR);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  test('should write a fatal log', async () => {
    const logger: Logger = new Logger(flow);
    await logger.fatal(content);

    const savedLog = await LogModel.findOne({
      where: {
        flow,
        content
      }
    });

    expect(savedLog.level).toBe(LogType.FATAL);
    expect(savedLog.flow).toBe(flow);
    expect(savedLog.content).toBe(content);
  });

  afterEach(async () => {
    await LogModel.destroy({
      where: {
        flow,
        content,
      }
    })
  });
});
