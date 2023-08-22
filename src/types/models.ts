export interface LogAttributes {
    level: string,
    flow: string,
    content: string,
    logGroupId?: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface ErrorExceptionAttributes {
    package: string,
    flow: string,
    name: string,
    message: string,
    stackStr: string,
    logGroupId?: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface StackAttributes {
    file: string,
    function: string,
    line: number,
    column: number,
    errorExceptionId: number,
}

export interface CodeLineAttributes {
    line: number,
    content: string,
    isErrorLine: boolean,
    stackId: number,
}

export interface SystemDetailsAttributes {
    arch: string,
    processor: string,
    hostname: string,
    platform: string,
    platformRelease: string,
    platformVersion: string,
    user: string,
    errorExceptionId: number,
}

export interface ExecutionDetailsAttributes {
    language: string,
    version: string,
    executionFinishTime: Date,
    errorExceptionId: number,
}

export interface ExecutionArgumentAttributes {
    argument: string,
    executionDetailsId: number,
}

export interface EnvironmentDetailsAttributes {
    name: string,
    value: string,
    errorExceptionId: number,
}

export interface ExtraDetailsAttributes {
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