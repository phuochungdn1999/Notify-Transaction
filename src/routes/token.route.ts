import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import FindTokensService from '@/services/external/token/find.service';
import GetSignedTxTokenService from '@/services/internal/token/getSignedTx.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class TokenRoute implements Routes {
  public path = '/v1/tokens';
  public router = Router();
  private findTokensService = new FindTokensService();
  private getSignedTxTokenService = new GetSignedTxTokenService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/withdrawHistories', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const tokenTypeList = req.query.tokenType ? req.query.tokenType : undefined;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          tokenType: tokenTypeList,
          type: 'WITHDRAW',
          status: req.query.status,
        }
      } as any;

      return await this.findTokensService.paginateWithdrawHistories(user.walletID, params);
    }));

    this.router.get('/withdrawHistories/:id/getSignedTxWithdraw', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.getSignedTxTokenService.generateSignedTxWithdraw(user.walletID, id)
      };
    }));

    this.router.get('/depositHistories', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const tokenTypeList = req.query.tokenType ? Array(req.query.tokenType) : undefined;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          tokenType: tokenTypeList,
          type: 'DEPOSIT',
          status: req.query.status,
        }
      } as any;


      return await this.findTokensService.paginateDepositHistories(user.walletID, params);
    }));

    this.router.get('/tokenTransactionHistories', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;

      const tokenTypeList = req.query.tokenType ? req.query.tokenType : undefined;
      const type = req.query.type ? req.query.type : undefined;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          tokenType: tokenTypeList,
          type: type,
          status: req.query.status,
        }
      } as any;


      return await this.findTokensService.paginateDepositHistories(user.walletID, params);
    }));

    this.router.get('/:id/updateStatusClaim', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return await this.findTokensService.updateStatusClaim(user.walletID, id);
    }));

    this.router.get('/:id/backToGame', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return await this.findTokensService.backToGame(user.walletID, id);
    }));
  }
}
