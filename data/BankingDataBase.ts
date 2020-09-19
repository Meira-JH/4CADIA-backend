import { Account } from "model/Account";
import { BankTransaction } from "model/BankTransaction";
import { ServerDataBase } from "./ServerDataBase";

export class BankingDataBase extends ServerDataBase {
  private static TABLE_NAME = "accounts";
  private static TABLE_NAME_B = "bank_transactions";
  private static TABLE_NAME_C = "users";

  public async createAccount(account: Account): Promise<void> {
    await this.getConnection().raw(`
            INSERT INTO ${BankingDataBase.TABLE_NAME}
            VALUES(
                '${account.id}',
                '${account.user_id}'
            );
        `);
  }

  public async addBalance(credit: BankTransaction): Promise<any> {
    console.log("add balance id", credit);
    await this.getConnection()
      .into(BankingDataBase.TABLE_NAME_B)
      .insert(credit);
  }

  public async getAccountsByUserId(userId: string): Promise<Account> {
    console.log("banking id", userId);
    const resultDatabase = await this.getConnection()
      .select("*")
      .from(BankingDataBase.TABLE_NAME)
      .where({ user_id: userId });

    console.log("result balance", resultDatabase[0]);
    return resultDatabase[0];
  }

  public async getBalanceByAccountId(accountId: string): Promise<any> {
    console.log("banking id", accountId);
    const resultDatabase = await this.getConnection()
      .select()
      .sum("value")
      .from(BankingDataBase.TABLE_NAME_B)
      .where({ account_id: accountId });

    console.log("result balance", resultDatabase[0]);
    return resultDatabase[0];
  }

  public async getStatementByAccountId(accountId: string): Promise<any> {
    console.log("account id", accountId);
    const resultDatabase = await this.getConnection().raw(`
        SELECT 
          users.name,
          bt.*
        FROM ${BankingDataBase.TABLE_NAME_B} bt
        RIGHT JOIN ${BankingDataBase.TABLE_NAME_C}
          ON bt.user_id = ${BankingDataBase.TABLE_NAME_C}.id
        RIGHT JOIN ${BankingDataBase.TABLE_NAME}
          ON bt.account_id = ${BankingDataBase.TABLE_NAME}.id
        WHERE bt.account_id = '${accountId}'
        GROUP BY 
          bt.value, ${BankingDataBase.TABLE_NAME_C}.id, 
          ${BankingDataBase.TABLE_NAME}.id, 
          bt.id
        ORDER BY bt.date;
    `);

    console.log("result statement", resultDatabase.rows);
    return resultDatabase.rows;
  }

  public async getUserById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(BankingDataBase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
