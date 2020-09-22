import { UserBusiness } from "../business/UserBusiness";
import { Request, Response } from "express";
import { IdGenerator } from "../service/IdGenetor";
import { HashManager } from "../service/HashManager";
import { UserDatabase } from "../data/UserDataBase";
import { Authenticator } from "../service/Authenticator";
import { RefreshTokenDataBase } from "../data/RefreshTokenDataBase";
import { User } from "model/User";
import { RefreshTokenDTO } from "model/RefreshTokenDTO";

export class UserController {
  async signup(request: Request, response: Response) {
    const { name, cpf, password, birthdate, device, role } = request.body;
    const newId = new IdGenerator().generate();

    const newHash = await new HashManager().createHash(password);

    const user: User = {
      id: newId,
      name,
      password: newHash,
      cpf,
      birthdate,
      device,
      role,
    };

    await new UserBusiness(new HashManager(), new UserDatabase()).signup(user);

    const newAccessToken = new Authenticator().generateToken(
      {
        id: newId,
        role,
      },
      "1d"
    );

    const newRefreshToken = new Authenticator().generateToken(
      {
        id: newId,
        device: device,
      },
      process.env.REFRESH_TOKEN_EXPIRES_IN
    );

    const refreshTokenToStore: RefreshTokenDTO = {
      token: newRefreshToken,
      device,
      isActive: true,
      userId: newId,
    };

    await new RefreshTokenDataBase().storeRefreshToken(refreshTokenToStore);

    response.status(200).send({
      message: "Usuário criado com sucesso!",
      "token de acesso": newAccessToken,
      "refresh token": newRefreshToken,
    });
  }

  async login(request: Request, response: Response) {
    const { cpf, password, device } = request.body;
    const user = await new UserBusiness(
      new HashManager(),
      new UserDatabase()
    ).login(cpf, password);

    const authenticator = new Authenticator();
    const accessToken = authenticator.generateToken(
      { id: user.id, role: user.role },
      "1d"
    );

    const refreshToken = authenticator.generateToken(
      { id: user.id, device },
      process.env.REFRESH_TOKEN_EXPIRES_IN
    );

    const refreshTokenDatabase = new RefreshTokenDataBase();
    const retrievedTokenFromDatabase = await refreshTokenDatabase.getRefreshTokenByIdAndDevice(
      user.id,
      device
    );
    console.log("refresh get by id device", retrievedTokenFromDatabase)

    if (retrievedTokenFromDatabase) {
      await refreshTokenDatabase.deleteRefreshToken(
        retrievedTokenFromDatabase.token
      );
    }
    console.log('saiu do delete')

    const refreshTokenToStore: RefreshTokenDTO = {
      token: refreshToken,
      device,
      isActive: true,
      userId: user.id,
    };

    await refreshTokenDatabase.storeRefreshToken(refreshTokenToStore);

    console.log("fim do login refresh", refreshTokenToStore)
    response.status(200).send({
      accessToken,
      refreshToken,
    });
  }
}
