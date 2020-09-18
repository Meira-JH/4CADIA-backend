import { User } from "model/User";
import { UserDatabase } from "../data/UserDataBase";
import { CustomError } from "../model/CustomError";
import { HashManager } from "../service/HashManager";

export class UserBusiness {
  constructor(
    private hashManager: HashManager,
    private userDataBase: UserDatabase
  ) {}

  public async signup(user: User) {
    if (!user.name) {
      throw new CustomError("Nome inválido", 400);
    }

    await this.userDataBase.signup(user);
  }

  public async login(cpf: number, password: string) {
    console.log("userbusiness login cpf", cpf);
    const user = await this.userDataBase.getUserByCpf(cpf);

    if (!user) {
      throw new CustomError("Usuário inválido", 412);
    }

    const hashCompare = await this.hashManager.compare(password, user.password);

    if (!hashCompare) {
      throw new CustomError("Invalid password", 400);
    }

    return { id: user.id, role: user.role };
  }
}
