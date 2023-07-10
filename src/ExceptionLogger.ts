import fs from 'fs';
import os from 'os';
import { sequelize } from './db/models/index';
import {
  CodeLine as CodeLineType,
  ErrorException as ErrorExceptionType,
  ErrorStack,
  ExtraValue,
  ExtraVars,
  NodeVars,
  OsVars,
  PrepareStackTrace,
  ReportOptions,
} from './types';
import { // @ts-ignore
  CodeLine, // @ts-ignore
  EnvironmentDetails, // @ts-ignore
  ErrorException, // @ts-ignore
  ExecutionArguments, // @ts-ignore
  ExecutionDetails, // @ts-ignore
  ExtraDetails, // @ts-ignore
  LogGroup, // @ts-ignore
  Stack, // @ts-ignore
  SystemDetails,
} from './db/models/index';
import AbstractLogger from './AbstractLogger';


export default class Logger extends AbstractLogger {
  public static PACKAGE: string = 'NODE.JS';
  public static LANGUAGE: string = 'node.js';

  private readonly prepareStackTrace: PrepareStackTrace;
  private readonly codeLinesLimit: number;

  private errStack: ErrorStack[];
  private osVars: OsVars | null;
  private nodeVars: NodeVars | null;
  private envVars: NodeJS.ProcessEnv | null;
  private extraVars: ExtraVars;

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

  public async report(opts: ReportOptions | null = null): Promise<any> {
    this.loadOsVars();
    this.loadNodeVars();
    this.loadEnvVars();

    return await this.save(opts);
  }

  public addExtra(identifier: string, extra: ExtraValue): void {
    let value: ExtraValue = extra;

    if (typeof(extra) === 'object') {
      value = JSON.stringify(extra);
    } else {
      value = extra
    }

    this.extraVars[identifier] = value;
  }

  private readLinesSync(filePath: string, start: number, end: number): CodeLineType[] {
    const lines: CodeLineType[] = [];
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
    Error.prepareStackTrace = async (error: Error, stack: NodeJS.CallSite[]): Promise<ErrorStack[]> => {
      const errorName: string = error.name;
      const errorMessage: string = error.message;
      const errorStack: string = error.stack ?? '';

      return stack.map((callSite): ErrorStack => {
        const lineNumber: number = callSite.getLineNumber() ?? 0;
        const fileName: string = callSite.getFileName() ?? '';
        let code: CodeLineType[] = [];

        if (fileName && !fileName.startsWith('node')) {
          code = this.readLinesSync(fileName, lineNumber - this.codeLinesLimit, lineNumber + this.codeLinesLimit)
            .map((line: CodeLineType) => {
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

  private async save(opts: ReportOptions | null = null): Promise<ErrorException | null> {
    const t = await sequelize.transaction();
    
    try {
      // general error exception
      const generalInfo = this.errStack[0];

      const errorExceptionData: ErrorExceptionType = {
        flow: this.flow,
        package: Logger.PACKAGE,
        name: generalInfo.errorName,
        message: generalInfo.errorMessage,
        stackStr: generalInfo.errorStack,
      }

      if (opts && opts.group) {
        errorExceptionData.logGroupId = opts.group.id;
      }

      const errorException: ErrorException = await ErrorException.create(errorExceptionData, {
        transaction: t,
      });

      // stack information
      for (const stack of this.errStack as ErrorStack[]) {
        const stackData = {
          file: stack.fileName,
          function: stack.functionName,
          line: stack.lineNumber,
          column: stack.columnNumber,
          errorExceptionId: errorException.id,
        };
        const stackInstance = await Stack.create(stackData, {
          transaction: t,
        });

        const codeLinesData = [];
        for (const line of stack.code) {
          codeLinesData.push({
            line: line.line,
            content: line.content ?? '',
            isErrorLine: line.currentLine === line.line,
            stackId: stackInstance.id,
          });
        }
        await CodeLine.bulkCreate(codeLinesData, {
          transaction: t,
        });
      };

      // system details
      const systemDetailsData = {
        arch: this.osVars?.arch,
        processor: this.osVars?.cpus[0].model,
        hostname: this.osVars?.hostname,
        platform: this.osVars?.platform,
        platformRelease: this.osVars?.release,
        platformVersion: this.osVars?.version,
        user: this.osVars?.user.username,
        errorExceptionId: errorException.id,
      };
      await SystemDetails.create(systemDetailsData, {
        transaction: t,
      });

      // execution details
      const executionDetailsData = {
        language: Logger.LANGUAGE,
        version: this.nodeVars?.version,
        executionFinishTime: new Date(this.nodeVars!.datetime * 1000),
        errorExceptionId: errorException.id,
      };
      const executionDetailsInstance = await ExecutionDetails.create(executionDetailsData, {
        transaction: t,
      });

      const executionArgumentData = [];
      for (const argument of this.nodeVars!.args) {
        executionArgumentData.push({
          argument: argument,
          executionDetailsId: executionDetailsInstance.id,
        });
      }
      await ExecutionArguments.bulkCreate(executionArgumentData, {
        transaction: t,
      });

      // environment details
      const environmentDetailsData = [];
      for (const varKey in this.envVars) {
        environmentDetailsData.push({
          name: varKey,
          value: this.envVars[varKey],
          errorExceptionId: errorException.id,
        });
      }
      await EnvironmentDetails.bulkCreate(environmentDetailsData, {
        transaction: t,
      });

      // extra details
      if (Object.keys(this.extraVars).length) {
        const extraDetailsData = [];
        for (const extraKey in this.extraVars) {
          extraDetailsData.push({
            name: extraKey,
            value: this.extraVars[extraKey],
            isJson: this.isJson(this.extraVars[extraKey]),
            errorExceptionId: errorException.id,
          });
        }

        await ExtraDetails.bulkCreate(extraDetailsData, {
          transaction: t,
        });
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
