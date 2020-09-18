import { User } from "model/User";
import { ServerDataBase } from "./ServerDataBase";

export class UserDatabase extends ServerDataBase {
  private static TABLE_NAME = "users";

  public async signup(user: User): Promise<void> {
    await this.getConnection().raw(`
            INSERT INTO ${UserDatabase.TABLE_NAME}
            VALUES(
                '${user.id}',
                '${user.name}',
                '${user.password}',
                '${user.cpf}',
                '${user.birthdate}',
                '${user.device}',
                '${user.role}'
            );
        `);
  }

  public async getUserByCpf(cpf: number): Promise<any> {
    console.log("userdata cpf", cpf);
    const resultDatabase = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ cpf });

    console.log("result ", resultDatabase[0]);
    return resultDatabase[0];
  }

  public async getUserById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
