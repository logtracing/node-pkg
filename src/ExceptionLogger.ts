import fs from 'fs';
import os from 'os';
import { sequelize } from './db/models/index';
import { LoggingOptions } from './types/general';
import {
  CodeLineData,
  ErrorStackData,
  ExtraValue,
  ExtraVarsData,
  NodeVarsData,
  OsVarsData,
  PrepareStackTrace
} from './types/errorException';
import {
  CodeLineAttributes,
  EnvironmentDetailsAttributes,
  ErrorExceptionAttributes,
  ExecutionArgumentAttributes,
  ExecutionDetailsAttributes,
  ExtraDetailsAttributes,
  StackAttributes,
  SystemDetailsAttributes
} from './types/models';
import { // @ts-ignore
  CodeLine, // @ts-ignore
  EnvironmentDetails, // @ts-ignore
  ErrorException, // @ts-ignore
  ExecutionArguments, // @ts-ignore
  ExecutionDetails, // @ts-ignore
  ExtraDetails, // @ts-ignore
  Stack, // @ts-ignore
  SystemDetails,
} from './db/models/index';
import AbstractLogger from './AbstractLogger';

export default class Logger extends AbstractLogger {
  public static PACKAGE: string = 'NODE.JS';
  public static LANGUAGE: string = 'node.js';

  private readonly prepareStackTrace: PrepareStackTrace;
  private readonly codeLinesLimit: number;

  private errStack: ErrorStackData[];
  private osVars: OsVarsData | null;
  private nodeVars: NodeVarsData | null;
  private envVars: NodeJS.ProcessEnv | null;
  private readonly extraVars: ExtraVarsData;

  constructor(flow: string) {
    super(flow);

    this.prepareStackTrace = Error.prepareStackTrace;
    this.errStack = [];
    this.osVars = null;
    this.nodeVars = null;
    this.envVars = null;
    this.extraVars = {};
    this.codeLinesLimit = 5;
  }

  public async trackError(err: any): Promise<void> {
    if (!err) {
      throw new Error('Error argument is missing');
    }

    this.useCustomPrepareStackTrace();
    this.errStack = await err.stack;
    this.restorePrepareStackTrace();
  }

  public async report(opts: LoggingOptions | null = null): Promise<any> {
    this.loadOsVars();
    this.loadNodeVars();
    this.loadEnvVars();

    return await this.save(opts);
  }

  public addExtra(identifier: string, extra: ExtraValue): void {
    let value: ExtraValue;

    if (typeof(extra) === 'object') {
      value = JSON.stringify(extra);
    } else {
      value = extra
    }

    this.extraVars[identifier] = value;
  }

  private readLinesSync(filePath: string, start: number, end: number): CodeLineData[] {
    const lines: CodeLineData[] = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8').split('\n');

    for (let i = start - 1; i < end - 1; i++) {
      lines.push({
        line: i+1,
        content: fileContent[i],
      });
    }

    return lines;
  }

  private useCustomPrepareStackTrace(): void {
    Error.prepareStackTrace = async (error: Error, stack: NodeJS.CallSite[]): Promise<ErrorStackData[]> => {
      const errorName: string = error.name;
      const errorMessage: string = error.message;
      const errorStack: string = error.stack ?? '';

      return stack.map((callSite): ErrorStackData => {
        const lineNumber: number = callSite.getLineNumber() ?? 0;
        const fileName: string = callSite.getFileName() ?? '';
        let code: CodeLineData[] = [];

        if (fileName && !fileName.startsWith('node')) {
          code = this.readLinesSync(fileName, lineNumber - this.codeLinesLimit, lineNumber + this.codeLinesLimit)
            .map((line: CodeLineData) => {
              return {
                ...line,
                currentLine: lineNumber,
              }
            });
        }

        return {
          errorName,
          errorMessage,
          errorStack,
          functionName: callSite.getFunctionName() ?? 'anonymous',
          fileName,
          lineNumber,
          columnNumber: callSite.getColumnNumber() ?? 0,
          code,
        }
      });
    };
  }

  private restorePrepareStackTrace(): void {
    Error.prepareStackTrace = this.prepareStackTrace;
  }

  private loadOsVars(): void {
    this.osVars = {
      arch: os.arch(),
      cpus: os.cpus(),
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      version: os.version(),
      user: {
        username: os.userInfo().username,
        uid: os.userInfo().uid,
        gid: os.userInfo().gid,
      }
    };
  }

  private loadNodeVars(): void {
    this.nodeVars = {
      version: process.version,
      args: process.argv,
      datetime: Math.floor((new Date()).getTime() / 1000)
    };
  }

  private loadEnvVars(): void {
    this.envVars = process.env;
  }

  private isJson(possibleJson: string): boolean {
    try {
        JSON.parse(possibleJson);
    } catch (e) {
        return false;
    }
    return true;
  }

  private async saveErrorException(transaction: any, options: LoggingOptions | null): Promise<ErrorException | null> {
    const generalInfo = this.errStack[0];
    const data: ErrorExceptionAttributes = {
      flow: this.flow,
      package: Logger.PACKAGE,
      name: generalInfo.errorName,
      message: generalInfo.errorMessage,
      stackStr: generalInfo.errorStack,
    }

    if (options && options.group) {
      data.logGroupId = options.group.id;
    }

    return await ErrorException.create(data, {
      transaction: transaction,
    });
  }

  private async saveStackInformation(errorException: ErrorException, transaction: any): Promise<void> {
    for (const stack of this.errStack as ErrorStackData[]) {
      const stackData: StackAttributes = {
        file: stack.fileName,
        function: stack.functionName,
        line: stack.lineNumber,
        column: stack.columnNumber,
        errorExceptionId: errorException.id,
      };

      const stackInstance = await Stack.create(stackData, {
        transaction: transaction,
      });

      const codeLinesData: CodeLineAttributes[] = [];
      for (const line of stack.code) {
        codeLinesData.push({
          line: line.line,
          content: line.content ?? '',
          isErrorLine: line.currentLine === line.line,
          stackId: stackInstance.id,
        });
      }

      await CodeLine.bulkCreate(codeLinesData, {
        transaction: transaction,
      });
    }
  }

  private async saveSystemDetails(errorException: ErrorException, transaction: any): Promise<void> {
    const systemDetailsData: SystemDetailsAttributes = {
      arch: this.osVars?.arch ?? '',
      processor: this.osVars?.cpus[0].model ?? '',
      hostname: this.osVars?.hostname ?? '',
      platform: this.osVars?.platform ?? '',
      platformRelease: this.osVars?.release ?? '',
      platformVersion: this.osVars?.version ?? '',
      user: this.osVars?.user.username ?? '',
      errorExceptionId: errorException.id,
    };

    await SystemDetails.create(systemDetailsData, {
      transaction: transaction,
    });
  }

  private async saveExecutionDetails(errorException: ErrorException, transaction: any): Promise<void> {
    const executionDetailsData: ExecutionDetailsAttributes = {
      language: Logger.LANGUAGE,
      version: this.nodeVars?.version ?? '',
      executionFinishTime: new Date(this.nodeVars!.datetime * 1000),
      errorExceptionId: errorException.id,
    };

    const executionDetailsInstance = await ExecutionDetails.create(executionDetailsData, {
      transaction: transaction,
    });

    const executionArgumentData: ExecutionArgumentAttributes[] = [];
    for (const argument of this.nodeVars!.args) {
      executionArgumentData.push({
        argument: argument,
        executionDetailsId: executionDetailsInstance.id,
      });
    }

    await ExecutionArguments.bulkCreate(executionArgumentData, {
      transaction: transaction,
    });
  }

  private async saveEnvironmentDetails(errorException: ErrorException, transaction: any): Promise<void> {
    const environmentDetailsData: EnvironmentDetailsAttributes[] = [];
      for (const varKey in this.envVars) {
        environmentDetailsData.push({
          name: varKey,
          value: this.envVars[varKey] ?? '',
          errorExceptionId: errorException.id,
        });
      }

      await EnvironmentDetails.bulkCreate(environmentDetailsData, {
        transaction: transaction,
      });
  }

  private async saveExtraDetails(errorException: ErrorException, transaction: any): Promise<void> {
    const extraDetailsData: ExtraDetailsAttributes[] = [];
    for (const extraKey in this.extraVars) {
      extraDetailsData.push({
        name: extraKey,
        value: this.extraVars[extraKey],
        isJson: this.isJson(this.extraVars[extraKey]),
        errorExceptionId: errorException.id,
      });
    }

    await ExtraDetails.bulkCreate(extraDetailsData, {
      transaction: transaction,
    });
  }

  private async save(options: LoggingOptions | null = null): Promise<ErrorException | null> {
    const t = await sequelize.transaction();
    
    try {
      const errorException: ErrorException = await this.saveErrorException(t, options);
      await this.saveStackInformation(errorException, t);
      await this.saveSystemDetails(errorException, t);
      await this.saveExecutionDetails(errorException, t);
      await this.saveEnvironmentDetails(errorException, t);

      if (Object.keys(this.extraVars).length) {
        await this.saveExtraDetails(errorException, t);
      }

      await t.commit();

      return errorException;
    } catch (err) {
      console.error(err);

      await t.rollback();
      return null;
    }
  }
};
