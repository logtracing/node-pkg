// @ts-ignore
import { LogGroup } from '../db/models';
import { LogType } from './logger';

export interface LogReporterOptions {
    limit?: number,
    offset?: number,
    level?: LogType,
    groupName?: LogGroup
}

export interface LogReporterSegments {
    [identifier: string]: any,
}

export interface LogReporterObject {
    flow: string,
    datetime: string,
    level: LogType,
    content: string,
    group?: LogGroup,
}