import { BankingController } from "../controller/BankingController";
import { Router } from "express";

export const bankingRoutes = Router();
const bankingController = new BankingController();

bankingRoutes.post("/createAccount", bankingController.createAccount);
bankingRoutes.get("/getAccounts", bankingController.getAccounts);
bankingRoutes.post("/addBalance", bankingController.addBalance);
bankingRoutes.get("/getBalance/:accountId", bankingController.getBalance);
bankingRoutes.get("/getStatement/:accountId", bankingController.getStatement);
