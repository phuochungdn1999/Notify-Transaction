import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import saleIDOService from '@/services/external/IDO/IDO.service';
import FindUsersService from '@/services/external/user/find.service';
import UpdateUserService from '@/services/external/user/update.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';
const uuid = require('uuid').v4;

export class LaunchpadRoute implements Routes {
  public path = '/v1/launchpad';
  public router = Router();
  public findUsersService = new FindUsersService();
  public updateUserService = new UpdateUserService();
  public saleIDOService = new saleIDOService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      "/getListLaunchpad",
      routeWrapper(async (req: any) => {
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
          sort: req.query.sort ? req.query.sort : undefined,
          filter: {},
        } as any;

        return await this.saleIDOService.getListLaunchpad(params);

      })
    );

    this.router.get(
      "/:id/getLaunchpad",
      passportAuthenticateJWT,
      routeWrapper(async (req: any) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return await this.saleIDOService.getLaunchpad(id, user.walletID);

      })
    );

    this.router.post(
      "/getSignedTxBuyIDO",
      passportAuthenticateJWT,
      routeWrapper(async (req: any) => {
        const user = req.user as UserInstance;
        const { launchpadId, tokenAddress, amount, type } = req.body;

        return {
          data: await this.saleIDOService.getSignedTxBuyIDO(launchpadId, tokenAddress, user.walletID, amount, type)
        };

      })
    );

    this.router.put(
      "/:id/deleteOrderBuyIDO",
      passportAuthenticateJWT,
      routeWrapper(async (req: any) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return await this.saleIDOService.deleteOrderBuyIDO(id, user.walletID);
      })
    );

    this.router.post(
      "/getSignedTxClaimIDO",
      passportAuthenticateJWT,
      routeWrapper(async (req: any) => {
        const user = req.user as UserInstance;
        const { launchpadId, tokenAddress, type } = req.body;

        return {
          data: await this.saleIDOService.getSignedTxClaimIDO(launchpadId, tokenAddress, user.walletID, type)
        };

      })
    );
  }
}
