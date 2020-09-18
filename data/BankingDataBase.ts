import { Account } from "model/Account";
import { ServerDataBase } from "./ServerDataBase";

export class BankingDataBase extends ServerDataBase {
  private static TABLE_NAME = "accounts";

  public async createAccount(account: Account): Promise<void> {
    await this.getConnection().raw(`
            INSERT INTO ${BankingDataBase.TABLE_NAME}
            VALUES(
                '${account.id}',
                '${account.userId}',
                '${account.balance}'
            );
        `);
  }

  public async getAccountByUserId(userId: string): Promise<Account> {
    console.log("banking id", userId);
    const resultDatabase = await this.getConnection()
      .select("*")
      .from(BankingDataBase.TABLE_NAME)
      .where({ user_id: userId });

    console.log("result balance", resultDatabase[0]);
    return resultDatabase[0];
  }

  public async getStatementById(cpf: number): Promise<Account> {
    console.log("banking cpf", cpf);
    const resultDatabase = await this.getConnection()
      .select("*")
      .from(BankingDataBase.TABLE_NAME)
      .where({ cpf });

    console.log("result statement", resultDatabase[0]);
    return resultDatabase[0];
  }

  public async getUserById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(BankingDataBase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
