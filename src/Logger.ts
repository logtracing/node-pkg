import fs from 'fs';
import os from 'os';
import { PrismaClient, Error as ErrorModel, ErrorGroup } from '@prisma/client';
import { CodeLine, ErrorStack, ExtraVars, ExtraValue, NodeVars, OsVars, PrepareStackTrace, ReportOptions } from './types';
import { group } from 'console';

export default class Logger {
  private readonly _flow: string;
  private readonly prepareStackTrace: PrepareStackTrace;
  private readonly codeLinesLimit: number;

  private errStack: ErrorStack[];
  private osVars: OsVars | null;
  private nodeVars: NodeVars | null;
  private envVars: NodeJS.ProcessEnv | null;
  private extraVars: ExtraVars;

  private prisma: PrismaClient;

  constructor(flow: string) {
    if (!flow) {
      throw new Error('Flow argument is missing');
    }

    this._flow = flow;
    this.prepareStackTrace = Error.prepareStackTrace;
    this.errStack = [];
    this.osVars = null;
    this.nodeVars = null;
    this.envVars = null;
    this.extraVars = {};
    this.codeLinesLimit = 5;

    this.prisma = new PrismaClient();
  }

  public get flow(): string {
    return this._flow;
  }

  public async trackError(err: any): Promise<void> {
    if (!err) {
      throw new Error('Error argument is missing');
    }

    this.useCustomPrepareStackTrace();
    this.errStack = await err.stack;
    this.restorePrepareStackTrace();
  }

  public async report(opts: ReportOptions | null = null): Promise<ErrorModel | null> {
    this.loadOsVars();
    this.loadNodeVars();
    this.loadEnvVars();

    return await this.store(opts);
  }

  public addExtra(identifier: string, extra: ExtraValue): void {
    let value: ExtraValue = extra;

    if (typeof(extra) === 'object') {
      value = JSON.stringify(extra);
    }

    this.extraVars[identifier] = value;
  }

  public async getOrCreateGroup(name: string): Promise<ErrorGroup | null> {
    try {
      const groupName: string = name.toLocaleLowerCase();

      const errorGroupCreated = await this.prisma.errorGroup.upsert({
        where: { name: groupName },
        create: { name: groupName },
        update: {},
      });
      await this.prisma.$disconnect();
      
      return errorGroupCreated;
    } catch (err) {
      console.error(err);

      await this.prisma.$disconnect();
      return null;
    }
  }

  private readLinesSync(filePath: string, start: number, end: number): CodeLine[] {
    const lines: CodeLine[] = [];
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
        let code: CodeLine[] = [];

        if (fileName && !fileName.startsWith('node')) {
          code = this.readLinesSync(fileName, lineNumber - this.codeLinesLimit, lineNumber + this.codeLinesLimit)
            .map((line: CodeLine) => {
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

  private async store(opts: ReportOptions | null = null): Promise<ErrorModel | null> {
    // Stack & CodeLine
    const stackData = [];
    for (const stack of this.errStack as ErrorStack[]) {
      const codeLinesData = [];

      for (const line of stack.code) {
        codeLinesData.push({
          line: line.line,
          content: line.content ?? '',
          isErrorLine: line.currentLine === line.line,
        });
      }

      stackData.push({
        file: stack.fileName,
        function: stack.functionName,
        line: stack.lineNumber,
        column: stack.columnNumber,
        code: {
          create: codeLinesData,
        },
      });
    };

    // SystemDetails
    const systemDetailsData = {
      arch: this.osVars?.arch,
      processor: this.osVars?.cpus[0].model,
      hostname: this.osVars?.hostname,
      platform: this.osVars?.platform,
      platformRelease: this.osVars?.release,
      platformVersion: this.osVars?.version,
      user: this.osVars?.user.username,
    };

    // ExecutionDetails & ExecutionArgument
    const executionArgumentData = [];
    for (const argument of this.nodeVars!.args) {
      executionArgumentData.push({
        argument: argument
      });
    }

    const executionDetailsData = {
      language: 'NodeJS',
      version: this.nodeVars?.version,
      executionFinishTime: new Date(this.nodeVars!.datetime * 1000),
      arguments: {
        create: executionArgumentData,
      },
    };

    // Get EnvironmentDetails
    const environmentDetailsData = [];
    for (const varKey in this.envVars) {
      environmentDetailsData.push({
        name: varKey,
        value: this.envVars[varKey]
      });
    }

    // ExtraDetails
    const extraDetailsData = [];
    for (const extraKey in this.extraVars) {
      extraDetailsData.push({
        name: extraKey,
        value: this.extraVars[extraKey]
      });
    }

    try {
      const generalInfo = this.errStack[0];

      const errorDB: any = {
        data: {
          flow: this.flow,
          package: 'Node.js',
          name: generalInfo.errorName,
          message: generalInfo.errorMessage,
          stackStr: generalInfo.errorStack,
          stack: {
            create: stackData,
          },
          systemDetails: {
            create: systemDetailsData,
          },
          executionDetails: {
            create: executionDetailsData,
          },
          environmentDetails: {
            create: environmentDetailsData,
          },
        }
      }

      if (extraDetailsData.length) {
        errorDB.data.extraDetails = {
          create: extraDetailsData,
        };
      }

      if (opts && opts.group) {
        errorDB.data.errorGroup = {
          connect: { id: opts.group.id },
        };
      }

      const createdError = await this.prisma.error.create(errorDB);
      await this.prisma.$disconnect();

      return createdError;
    } catch (err) {
      console.error(err);

      await this.prisma.$disconnect();
      return null;
    }
  }
};
