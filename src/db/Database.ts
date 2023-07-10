import { // @ts-ignore
  Log,
} from './models/index';
import { SimpleLog } from '../types'; 
import { sequelize } from './models/index';

export default class Database {
  public constructor() {

  }

  public async saveLog(data: SimpleLog): Promise<Log | null> {
    const transaction = await this.startTransaction();

    try {
      const log = await Log.create(data, { transaction });
      await transaction.commit();

      return log;
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  }

  private async startTransaction() {
    return await sequelize.transaction();
  }

  private async endTransaction(transaction: any) {
    await transaction.commit();
  }
}
