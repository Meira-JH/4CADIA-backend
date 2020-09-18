import express from "express";
import "express-async-errors";
import { AddressInfo } from "net";
import errorCatcher from "./middleware/ErrorCatcher";
import { userRoutes } from "./routes/UserRoutes";
import { bankingRoutes } from "./routes/BankingRoutes";
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as swaggerJson from './swagger.json'


const app = express();

app.use(express.json());
var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
  }
app.use(cors())
app.use(errorCatcher);

app.use("/user", userRoutes);
app.use("/banking", bankingRoutes);

const server = app.listen(process.env.PORT || 3000, () => {
  if (server) {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson))
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}/`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});