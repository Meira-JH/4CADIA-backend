import { Request, Response } from "express";
import { IdGenerator } from "../service/IdGenetor";
import { Authenticator } from "../service/Authenticator";
import { Account } from "../model/Account";
import { CustomError } from "../model/CustomError";
import { BankingDataBase } from "../data/BankingDataBase";
import { BankingBusiness } from "../business/BankingBusiness";

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
      userId: user.id,
      balance: 0,
    };

    await new BankingBusiness(new BankingDataBase()).createAccount(account);

    response.status(200).send({
      message: "Conta criada com sucesso!",
    });
  }
  async getAccount(request: Request, response: Response) {
    const token = request.headers.token as string;
    const user = new Authenticator().getData(token);
    if (!user) {
      throw new CustomError("Problemas de autenticação. Logue novamente", 401);
    }

    const accountInfo = await new BankingBusiness(
      new BankingDataBase()
    ).getAccount(user.id);

    console.log(accountInfo)
    response.status(200).send({
      accountInfo,
    });
  }
}
