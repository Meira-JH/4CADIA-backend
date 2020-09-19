import { Account } from "../model/Account";
import { BankingDataBase } from "../data/BankingDataBase";
import { BankTransaction } from "model/BankTransaction";

export class BankingBusiness {
  constructor(private bankingDataBase: BankingDataBase) {}

  public async createAccount(account: Account) {
    await this.bankingDataBase.createAccount(account);
  }

  public async getAccounts(userId: string) {
    return await this.bankingDataBase.getAccountsByUserId(userId);
  }

  public async getBalance(userId: string) {
    return await this.bankingDataBase.getBalanceByAccountId(userId);
  }

  public async addBalance(credit: BankTransaction) {
    return await this.bankingDataBase.addBalance(credit);
  }

  public async getStatement(accountId: string) {
    return await this.bankingDataBase.getStatementByAccountId(accountId);
  }
}
