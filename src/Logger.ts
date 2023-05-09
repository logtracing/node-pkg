import fs from 'fs';
import os from 'os';
import { CodeLine, ErrorStack, NodeVars, OsVars, PrepareStackTrace } from './types';

export default class Logger {
  private readonly _flow: string;

  private readonly prepareStackTrace: PrepareStackTrace;
  private readonly codeLinesLimit: number;
  private errStack: any;

  constructor(flow: string) {
    this._flow = flow;
    this.prepareStackTrace = Error.prepareStackTrace;
    this.errStack = [];

    this.codeLinesLimit = 5;
  }

  public get flow(): string {
    return this._flow;
  }

  private get osVars(): OsVars {
    return {
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

  private get nodeVars(): NodeVars {
    return {
      version: process.version,
      args: process.argv,
      datetime: Math.floor((new Date()).getTime() / 1000)
    };
  }

  public async trackError(err: any): Promise<void> {
    this.useCustomPrepareStackTrace();
    this.errStack = await err.stack;
    this.restorePrepareStackTrace();
  }

  public report(): void {
    console.log(this.errStack);
  }

  private readLinesSync(filePath: string, start: number, end: number): CodeLine[] {
    const lines: CodeLine[] = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8').split('\n');

    for (let i = start - 1; i < end - 1; i++) {
      lines.push({
        line: i-1,
        content: fileContent[i],
      });
    }

    return lines;
  }

  private useCustomPrepareStackTrace(): void {
    Error.prepareStackTrace = async (error: Error, stack: NodeJS.CallSite[]): Promise<ErrorStack[]> => {
      const errMessage: string = error.stack ?? '';

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
          errMessage,
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
};
