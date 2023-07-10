// @ts-ignore
import { LogGroup } from './db/models/index';

export default abstract class AbstractLogger {
  private readonly _flow: string;

  constructor(flow: string) {
    if (!flow) {
      throw new Error('Flow argument is missing');
    }

    this._flow = flow;
  }

  public get flow(): string {
    return this._flow;
  }

  public async getOrCreateGroup(name: string): Promise<LogGroup | null> {
    try {
      const groupName: string = name.toLocaleLowerCase();

      const [group] = await LogGroup.findOrCreate({
        where: { name: groupName },
      });

      return group;
    } catch (err) {
      console.error(err);

      return null;
    }
  }
};
