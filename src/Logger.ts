import { sequelize } from './db/models/index';
import { LogTracingOptions, LoggingOptions } from './types/general';
import { LogAttributes } from './types/models';
import { LogType } from './types/logger';
// @ts-ignore
import { Log } from './db/models/index';
import AbstractLogger from './AbstractLogger';
import SlackMessageSender from './SlackMessageSender';
import { ChatPostMessageArguments } from '@slack/web-api';

export default class Logger extends AbstractLogger {
  private readonly slackIntegration: boolean = false;

  constructor(flow: string, options?: LogTracingOptions) {
    super(flow);

    if (options && options.slackIntegration) {
      this.slackIntegration = options.slackIntegration;
    }
  }

  public async trace(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.TRACE, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async debug(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.DEBUG, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async info(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.INFO, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async warn(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.WARN, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async error(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.ERROR, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async fatal(content: string, opts: LoggingOptions | null = null): Promise<Log> {
    try {
      return await this.save(LogType.FATAL, content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  private async save(level: string, content: string, opts: LoggingOptions | null): Promise<Log> {
    const t = await sequelize.transaction();

    try {
      const data: LogAttributes = {
          level,
          flow: this.flow,
          content,
      };

      if (opts && opts.group) {
        data.logGroupId = opts.group.id;
      }

      const log = await Log.create(data, {
        transaction: t,
      });
      await t.commit();

      if (this.slackIntegration) {
        const slackSender = SlackMessageSender.getInstance();
        const message: ChatPostMessageArguments = slackSender.getBaseMessageTemplate({
          title: this.flow,
          log: log,
        });

        if (opts?.slackMessageExtraSections) {
          message.blocks = message.blocks?.concat(opts.slackMessageExtraSections);
        }

        await slackSender.publishMessage(message);
      }

      return log;
    } catch (err) {
      console.error(err);
      await t.rollback();
    }
  }
}
