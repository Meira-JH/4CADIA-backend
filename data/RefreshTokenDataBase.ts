import { RefreshTokenDTO } from "model/RefreshTokenDTO";
import { ServerDataBase } from "./ServerDataBase";

export class RefreshTokenDataBase extends ServerDataBase {
  private static TABLE_NAME = "refresh_token";

  public async storeRefreshToken(reFreshToken: RefreshTokenDTO): Promise<void> {
    await this.getConnection().raw(`
        INSERT INTO ${RefreshTokenDataBase.TABLE_NAME}
          VALUES(
            '${reFreshToken.token}',
            '${reFreshToken.device}',
            '${reFreshToken.isActive}',
            '${reFreshToken.userId}'
          )
      `);
  }

  public async getRefreshToken(token: string): Promise<any> {
    const tokenInfo = await this.getConnection()
      .select("*")
      .from(RefreshTokenDataBase.TABLE_NAME)
      .where({
        refresh_token: token,
      });
    const retrievedToken = tokenInfo[0];

    return {
      token: retrievedToken.refresh_token,
      device: retrievedToken.device,
      isActive: Number(retrievedToken.is_active) === 1 ? true : false,
      userId: retrievedToken.user_id,
    };
  }

  public async getRefreshTokenByIdAndDevice(
    id: string,
    device: string
  ): Promise<any> {
    console.log("refreshtoken", id, device);

    const result = await this.getConnection()
      .select("*")
      .from(RefreshTokenDataBase.TABLE_NAME)
      .where({
        user_id: id,
        device,
      });

    if (result[0] === undefined) {
      return undefined;
    }

    console.log("resultado refresh", result[0]);
    const retrievedToken = result[0];

    return {
      token: retrievedToken.refresh_token,
      device: retrievedToken.device,
      isActive: super.convertIntToBoolean(retrievedToken.is_active),
      userId: retrievedToken.user_id,
    };
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    console.log("no delete refresh", token);
    await this.getConnection()
      .from(RefreshTokenDataBase.TABLE_NAME)
      .del()
      .where('refresh_token', token);
  }
}
