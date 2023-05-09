export type PrepareStackTrace = ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;

export interface CodeLine {
  line: number;
  content: string;
  currentLine?: number;
};

export interface ErrorStack {
  errMessage: string,
  functionName: string,
  fileName: string,
  lineNumber: number,
  columnNumber: number,
  code: CodeLine[],
};
