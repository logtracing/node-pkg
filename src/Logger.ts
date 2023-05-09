export default class Logger {
  private readonly _flow: string;

  constructor(flow: string) {
    this._flow = flow;
  }

  get flow(): string {
    return this._flow;
  }
};
