import { UserInstance } from "@/interfaces/model/user";
import { Routes } from "@/interfaces/routes";
import Identifier from "@/utils/identifier";
import { passportAuthenticateJWT, routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";
import { DatabaseController } from "../database/DatabaseController";
import { phone } from "phone";
import { ethers } from "ethers";
import { Wallets } from "@/models/wallet.model";

export class WalletRoute implements Routes {
  public path = "/v1/wallet";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", async (req, res, next) => {
      const { walletAddress, phoneNumber } = req.body;
      // console.lo

      console.log(phone(phoneNumber));
      if (!phone(phoneNumber).isValid) {
        return res.status(400).json({
          message: "Invalid phone number",
        });
      }

      if (!ethers.utils.isAddress(walletAddress)) {
        return res.status(400).json({
          message: "Invalid wallet address",
        });
      }
      const user = await Wallets.findOne({
        $or: [
          { walletAddress: walletAddress.toLowerCase() },
          { phoneNumber: phoneNumber },
        ],
      });
      if (user) {
        return res.status(400).json({
          message: "Already register",
        });
      }

      await DatabaseController.CreateNewWalletAddress(
        walletAddress,
        phoneNumber
      );

      return res.status(200).json({
        message: "Register success",
        walletAddress,
        phoneNumber,
      });
    });
  }
}
