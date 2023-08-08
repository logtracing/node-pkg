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