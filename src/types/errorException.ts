export type PrepareStackTrace = ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;

export interface CodeLineData {
    line: number;
    content: string;
    currentLine?: number;
}

export interface ErrorStackData {
    errorName: string,
    errorMessage: string,
    errorStack: string,
    functionName: string,
    fileName: string,
    lineNumber: number,
    columnNumber: number,
    code: CodeLineData[],
}

export interface OsUserData {
    username: string;
    uid: number;
    gid: number;
}

export interface OsCpuTimeData {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
}

export interface OsCpuData {
    model: string;
    speed: number;
    times: OsCpuTimeData;
}

export interface OsVarsData {
    arch: string;
    cpus: OsCpuData[];
    hostname: string;
    platform: string;
    release: string;
    version: string;
    user: OsUserData;
}

export interface NodeVarsData {
    version: string;
    args: string[],
    datetime: number;
}

export type ExtraValue = object | string;

export interface ExtraVarsData {
    [identifier: string]: string;
}