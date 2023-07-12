// @ts-ignore
import { LogGroup } from './db/models/index';
export type PrepareStackTrace = ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;

// General types
export interface LoggerOptions {
  group: any,
};

// Error Exception Entities Types
export interface CodeLineData {
  line: number;
  content: string;
  currentLine?: number;
};

export interface ErrorStackData {
  errorName: string,
  errorMessage: string,
  errorStack: string,
  functionName: string,
  fileName: string,
  lineNumber: number,
  columnNumber: number,
  code: CodeLineData[],
};

export interface OsUserData {
  username: string;
  uid: number;
  gid: number;
};

export interface OsCpuTimeData {
  user: number;
  nice: number;
  sys: number;
  idle: number;
  irq: number;
};

export interface OsCpuData {
  model: string;
  speed: number;
  times: OsCpuTimeData;
};

export interface OsVarsData {
  arch: string;
  cpus: OsCpuData[];
  hostname: string;
  platform: string;
  release: string;
  version: string;
  user: OsUserData;
};

export interface NodeVarsData {
  version: string;
  args: string[],
  datetime: number;
};

export type ExtraValue = object | string;

export interface ExtraVarsData {
  [identifier: string]: string;
};

// Logger Types
export enum LogType {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

// Model Data Types
export interface LogModelData {
  level: string,
  flow: string,
  content: string,
  logGroupId?: number,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface ErrorExceptionModelData {
  package: string,
  flow: string,
  name: string,
  message: string,
  stackStr: string,
  logGroupId?: number,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface StackModelData {
  file: string,
  function: string,
  line: number,
  column: number,
  errorExceptionId: number,
}

export interface CodeLineModelData {
    line: number,
    content: string,
    isErrorLine: boolean,
    stackId: number,
}

export interface SystemDetailsModelData {
  arch: string,
  processor: string,
  hostname: string,
  platform: string,
  platformRelease: string,
  platformVersion: string,
  user: string,
  errorExceptionId: number,
}

export interface ExecutionDetailsModelData {
  language: string,
  version: string,
  executionFinishTime: Date,
  errorExceptionId: number,
}

export interface ExecutionArgumentModelData {
  argument: string,
  executionDetailsId: number,
}

export interface EnvironmentDetailsModelData {
  name: string,
  value: string,
  errorExceptionId: number,
}

export interface ExtraDetailsModelData {
  name: string,
  value: string,
  isJson: boolean,
  errorExceptionId: number,
}

export interface ModelSearchQuery {
  limit: number,
  offset: number,
  where?: {
    [identifier: string]: any,
  },
  order?: string[][],
  include?: object[],
}

export interface LogReporterOptions {
  limit?: number,
  offset?: number,
  level?: LogType,
  groupName?: LogGroup
}
