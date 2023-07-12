import { LogReporterOptions, ModelSearchQuery, LogReporterSegments } from './types';
// @ts-ignore
import { Log, LogGroup } from './db/models/index';
import { Op } from 'sequelize';

export default class LogReporter {
  private static DEFAULT_LIMIT = 50;
  private static DEFAULT_OFFSET = 0;

  private flow: string;

  constructor(flow: string) {
    this.flow = flow;
  }

  getBasicLogs(options: LogReporterOptions = {}) {
    return new Promise((resolve, reject) => {
      const query: ModelSearchQuery = {
        limit: options.limit ?? LogReporter.DEFAULT_LIMIT,
        offset:  options.offset ?? LogReporter.DEFAULT_OFFSET,
        where: {
          flow: {
            [Op.eq]: this.flow,
          }
        },
        order: [
          ['createdAt', 'DESC'],
        ]
      };

      if (options.level) {
        query.where!.level = {
          [Op.eq]: options.level,
        };
      }

      if (options.groupName) {
        query.where = {
          ...query.where,
          ...{
            '$LogGroup.name$': {
              [Op.eq]: options.groupName.toLowerCase(),
            },
          }
        };

        query.include = [{
          model: LogGroup,
          as: 'LogGroup'
        }]
      }

      Log.findAll(query)
        .then((data: any) => resolve(
          data.map((log: Log) => {
            const segments = {
              group: options.groupName ?? null,
            };

            return this.format(log, segments);
          })
        ))
        .catch((err: any) => reject(err));
    });
  }

  getLogs(options: LogReporterOptions = {}) {
    return new Promise((resolve, reject) => {
      const query: ModelSearchQuery = {
        limit: options.limit ?? LogReporter.DEFAULT_LIMIT,
        offset:  options.offset ?? LogReporter.DEFAULT_OFFSET,
        where: {
          flow: {
            [Op.eq]: this.flow,
          }
        },
        order: [
          ['createdAt', 'DESC'],
        ],
        include: [
          { model: LogGroup, as: 'LogGroup' }
        ],
      };

      if (options.level) {
        query.where!.level = {
          [Op.eq]: options.level,
        };
      }

      if (options.groupName) {
        query.where = {
          ...query.where,
          ...{
            '$LogGroup.name$': {
              [Op.eq]: options.groupName.toLowerCase(),
            },
          }
        };
      }

      Log.findAll(query)
        .then((data: any) => resolve(data.map((log: Log) => {
          return {
            flow: this.flow,
            datetime: this.formatDate(log.createdAt),
            level: log.level,
            content: log.content,
            group: log.LogGroup ? log.LogGroup.name : null
          };
        })))
        .catch((err: any) => reject(err));
    });
  }

  private format(log: Log, segments: LogReporterSegments = {}): string {
    const newSegments: string[] = [
      `[${log.level.padEnd(5)}]`,
      `[${this.formatDate(log.createdAt)}]`,
    ];

    for (const segment in segments) {
      if (segments[segment]) {
        newSegments.push(`[${segments[segment]}]`);
      }
    }

    return `${newSegments.join('')}: ${log.content}`;
  }

  private formatDate(date: Date): string {
    return `${date.toJSON().slice(0, 19).replace('T', ' ')}`;
  }
}
