import { Account } from "../model/Account";
import { BankingDataBase } from "../data/BankingDataBase";

export class BankingBusiness {
  constructor(private bankingDataBase: BankingDataBase) {}

  public async createAccount(account: Account) {
    await this.bankingDataBase.createAccount(account);
  }

  public async getAccount(userId: string) {
    return await this.bankingDataBase.getAccountByUserId(userId);
  }
}
