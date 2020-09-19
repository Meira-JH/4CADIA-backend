import { Request, Response } from "express";
import { IdGenerator } from "../service/IdGenetor";
import { Authenticator } from "../service/Authenticator";
import { Account } from "../model/Account";
import { CustomError } from "../model/CustomError";
import { BankingDataBase } from "../data/BankingDataBase";
import { BankingBusiness } from "../business/BankingBusiness";
import { BankTransaction } from "model/BankTransaction";

export class BankingController {
  async createAccount(request: Request, response: Response) {
    const token = request.headers.token as string;
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const newAccountId = new IdGenerator().generate();

    const account: Account = {
      id: newAccountId,
      user_id: user.id,
    };

    await new BankingBusiness(new BankingDataBase()).createAccount(account);

    response.status(200).send({
      message: "Conta criada com sucesso!",
    });
  }
  async getAccounts(request: Request, response: Response) {
    const token = request.headers.token as string;
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const accountInfo = await new BankingBusiness(
      new BankingDataBase()
    ).getAccounts(user.id);

    console.log(accountInfo)
    response.status(200).send({
      accountInfo,
    });
  }

  async getBalance(request: Request, response: Response) {
    const token = request.headers.token as string;
    const accountId = request.params.accountId as string
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const balance = await new BankingBusiness(
      new BankingDataBase()
    ).getBalance(accountId);

    console.log(balance)
    response.status(200).send({
      balance: balance.sum,
    });
  }

  async getStatement(request: Request, response: Response) {
    const token = request.headers.token as string;
    const accountId = request.params.accountId as string
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const statement = await new BankingBusiness(
      new BankingDataBase()
    ).getStatement(accountId);

    console.log(statement)
    response.status(200).send({
      extrato: statement,
    });
  }

  async addBalance(request: Request, response: Response) {

    const {user_id, account_id, value, date, description} = request.body
    console.log(request.body)
    const token = request.headers.token as string;
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const newId = new IdGenerator().generate();

    const credit : BankTransaction = {
      id: newId,
      user_id,
      account_id,
      value: value,
      date: date,
      description: description
    }

     new BankingBusiness(
      new BankingDataBase()
    ).addBalance(credit);

    response.status(200).send({
      Message: 'Successful operation!'
    });
  }
}
