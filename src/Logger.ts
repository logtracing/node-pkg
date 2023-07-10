import { sequelize } from './db/models/index';
import { ReportOptions, SimpleLog } from './types';
// @ts-ignore
import { Log } from './db/models/index';
import AbstractLogger from './AbstractLogger';

export default class Logger extends AbstractLogger {
  constructor(flow: string) {
    super(flow);
  }

  public async trace(content: string, opts: ReportOptions | null = null): Promise<Log | null> {
    try {
      return await this.save('TRACE', content, opts);
    } catch (err) {
      console.error(err);
    }
  }
  
  public async debug(content: string, opts: ReportOptions | null = null): Promise<any | null> {
    try {
      return await this.save('DEBUG', content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async info(content: string, opts: ReportOptions | null = null): Promise<any | null> {
    try {
      return await this.save('INFO', content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async warn(content: string, opts: ReportOptions | null = null): Promise<any | null> {
    try {
      return await this.save('WARN', content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async error(content: string, opts: ReportOptions | null = null): Promise<any | null> {
    try {
      return await this.save('ERROR', content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  public async fatal(content: string, opts: ReportOptions | null = null): Promise<any | null> {
    try {
      return await this.save('FATAL', content, opts);
    } catch (err) {
      console.error(err);
    }
  }

  private async save(level: string, content: string, opts: ReportOptions | null): Promise<Log | null> {
    const t = await sequelize.transaction();
    
    try {
      const data: SimpleLog = {
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

      return log;
    } catch (err) {
      console.error(err);
      await t.rollback();
    }
  }
}
