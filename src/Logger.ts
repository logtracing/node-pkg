import fs from 'fs';
import os from 'os';
import { PrismaClient } from '@prisma/client';
import { CodeLine, ErrorStack, ExtraVars, NodeVars, OsVars, PrepareStackTrace } from './types';

export default class Logger {
  private readonly _flow: string;
  private readonly prepareStackTrace: PrepareStackTrace;
  private readonly codeLinesLimit: number;

  private errStack: any;
  private osVars: OsVars | null;
  private nodeVars: NodeVars | null;
  private envVars: NodeJS.ProcessEnv | null;
  private extraVars: ExtraVars;

  private prisma: PrismaClient;

  constructor(flow: string) {
    this._flow = flow;
    this.prepareStackTrace = Error.prepareStackTrace;
    this.errStack = null;
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
    this.useCustomPrepareStackTrace();
    this.errStack = await err.stack;
    this.restorePrepareStackTrace();
  }

  public async report(): Promise<void> {
    this.loadOsVars();
    this.loadNodeVars();
    this.loadEnvVars();

    // try {
    //   await this.storeIntoDB();
    //   await this.prisma.$disconnect();
    // } catch (err) {
    //   console.error(err)
    //   await this.prisma.$disconnect();
    // }
    console.log(this.errStack);
  }

  public addExtra(identifier: string, extra: any): void {
    this.extraVars[identifier] = extra;
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

        if (!fileName.startsWith('node')) {
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
      machine: os.machine(),
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

  private async storeIntoDB(): Promise<void> {
    const error = await this.prisma.error.create({
      data: {
        flowName: this.flow,
      },
    });

    console.log(error);
  }
};
