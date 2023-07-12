import { LogType, ModelSearchQuery } from './types';
// @ts-ignore
import { Log } from './db/models/index';
import { Op } from 'sequelize';

export default class LogReporter {
  constructor() {}

  getLogs(limit: number = 50, offset: number = 0, level: LogType | null = null) {
    return new Promise((resolve, reject) => {
      const query: ModelSearchQuery = {
        limit,
        offset,
      };

      if (level) {
        query.where = {
          level: {
            [Op.eq]: level,
          }
        };
      }

      Log.findAll(query)
        .then((data: any) => resolve(data))
        .catch((err: any) => reject(err));
    });
  }
}
