import { LogType, LogReporterOptions, ModelSearchQuery } from './types';
// @ts-ignore
import { Log } from './db/models/index';
import { Op } from 'sequelize';

export default class LogReporter {
  private static DEFAULT_LIMIT = 50;
  private static DEFAULT_OFFSET = 0;

  constructor() {}

  getBasicLogs(options: LogReporterOptions = {}) {
    return new Promise((resolve, reject) => {
      const query: ModelSearchQuery = {
        limit: options.limit ?? LogReporter.DEFAULT_LIMIT,
        offset:  options.offset ?? LogReporter.DEFAULT_OFFSET,
        order: [
          ['createdAt', 'DESC'],
        ]
      };

      if (options.level) {
        query.where = {
          level: {
            [Op.eq]: options.level,
          },
        };
      }

      Log.findAll(query)
        .then((data: any) => resolve(data.map((log: Log) => this.format(log))))
        .catch((err: any) => reject(err));
    });
  }

  private format(log: Log, options: object = {}): string {
    const segments: string[] = [
      `[${log.level.padEnd(5)}]`,
      `[${this.formatDate(log.createdAt)}]`,
    ];

    return `${segments.join('')}: ${log.content}`;
  }

  private formatDate(date: Date): string {
    return `${date.toJSON().slice(0, 19).replace('T', ' ')}`;
  }
}
