import { BankingController } from "../controller/BankingController";
import { Router } from "express";

export const bankingRoutes = Router();
const bankingController = new BankingController();

bankingRoutes.post("/createAccount", bankingController.createAccount);
bankingRoutes.get("/getAccount", bankingController.getAccount);
