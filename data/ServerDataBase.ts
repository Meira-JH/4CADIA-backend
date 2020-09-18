import knex from "knex";
import Knex from "knex";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

export class ServerDataBase {
  private static connection: Knex | null = null;

  protected convertIntToBoolean(value: number): boolean {
    return value === 1;
  }

  protected convertBooleanToInt(value: boolean): number {
    return value ? 1 : 0;
  }

  protected getConnection(): Knex {
    // new Client({
    //     host: process.env.DB_HOST,
    //     port: Number(process.env.DB_PORT),
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_DATABASE,
    //     ssl: true,
    //   });
    if (!ServerDataBase.connection) {
      ServerDataBase.connection = knex({
        client: "pg",
        connection: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          ssl: { rejectUnauthorized: false },
        },
      });
    }

    return ServerDataBase.connection;
  }

  public static async destroyConnection(): Promise<void> {
    if (ServerDataBase.connection) {
      await ServerDataBase.connection.destroy();
      ServerDataBase.connection = null;
    }
  }
}
