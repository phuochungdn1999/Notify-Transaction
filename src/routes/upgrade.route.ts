import { UserInstance } from '@/interfaces/model/user';
import { Routes } from "@/interfaces/routes";
import CompletedUpgradeService from '@/services/external/sneaker/completed.service';
import GetInfoUpgradeService from '@/services/external/sneaker/get.service';
import UpgradeService from '@/services/external/sneaker/upgrade.service';
import { passportAuthenticateJWT, routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";

export class UpgradeSneakerRoute implements Routes {
  public path = "/v1/upgrade/sneaker";
  public router = Router();
  public getInfoUpgradeService = new GetInfoUpgradeService();
  public upgradeService = new UpgradeService();
  public completedUpgradeService = new CompletedUpgradeService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      "/:id",
      routeWrapper(async (req, res) => {
        const { id } = req.params;
        const data = await this.getInfoUpgradeService.getInfo(id);
        res.send({ data });
      })
    );

    this.router.post(
      "/upgrade",
      passportAuthenticateJWT,
      routeWrapper(async (req, res) => {
        const user = req.user as UserInstance;
        if (req.body) {
          const data = await this.upgradeService.upgrade(user.walletID, req.body.itemId);
          res.send({ id: data.id });
        }
      })
    );

    this.router.post(
      "/completed",
      passportAuthenticateJWT,
      routeWrapper(async (req, res) => {
        const user = req.user as UserInstance;
        if (req.body) {
          const data = await this.completedUpgradeService.completed(user.walletID, req.body.itemId);
          res.send({ id: data.id });
        }
      })
    );
  }
}
