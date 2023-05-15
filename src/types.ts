export type PrepareStackTrace = ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;

export interface CodeLine {
  line: number;
  content: string;
  currentLine?: number;
};

export interface ErrorStack {
  errorName: string,
  errorMessage: string,
  errorStack: string,
  functionName: string,
  fileName: string,
  lineNumber: number,
  columnNumber: number,
  code: CodeLine[],
};

export interface OsUser {
  username: string;
  uid: number;
  gid: number;
};

export interface OsCpuTime {
  user: number;
  nice: number;
  sys: number;
  idle: number;
  irq: number;
};

export interface OsCpu {
  model: string;
  speed: number;
  times: OsCpuTime;
};

export interface OsVars {
  arch: string;
  cpus: OsCpu[];
  hostname: string;
  platform: string;
  release: string;
  version: string;
  user: OsUser;
};

export interface NodeVars {
  version: string;
  args: string[],
  datetime: number;
};

export interface ExtraVars {
  [identifier: string]: any;
};
