import { LogType, ModelSearchQuery } from './types';
// @ts-ignore
import { Log } from './db/models/index';
import { Op } from 'sequelize';

export default class LogReporter {
  constructor() {}

  getBasicLogs(limit: number = 50, offset: number = 0, level: LogType | null = null) {
    return new Promise((resolve, reject) => {
      const query: ModelSearchQuery = {
        limit,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ]
      };

      if (level) {
        query.where = {
          level: {
            [Op.eq]: level,
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
