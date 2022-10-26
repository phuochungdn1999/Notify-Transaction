import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import GetNFTBackToGameService from '@/services/external/nft/backToGame.service';
import FindNftsService from '@/services/external/nft/find.service';
import GetSignedTxNftService from '@/services/internal/nft/getSignedTx.service';
import Identifier from '@/utils/identifier';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class NftRoute implements Routes {
  public path = '/v1/nfts';
  public router = Router();
  public findNftService = new FindNftsService();
  public getSignedTxNftService = new GetSignedTxNftService();
  public getNFTBackToGameService = new GetNFTBackToGameService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/findByMarket', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType: req.query.nftType
        }
      } as any;

      if (req.query.type) {
        params.filter.type = String(req.query.type).split(',');
      }
      if (req.query.rarity) {
        params.filter.rarity = String(req.query.rarity).split(',');
      }
      if (req.query.class) {
        params.filter.class = String(req.query.class).split(',');
      }
      if (req.query.belongToParentId) {
        params.filter.belongToParentId = req.query.belongToParentId;
      }
      if (req.query.hasChildId) {
        params.filter.hasChildId = req.query.hasChildId;
      }
      if (req.query.brand) {
        params.filter.brand = String(req.query.brand).split(',');
      }
      if (req.query.priceTokenType) {
        params.filter.priceTokenType = req.query.priceTokenType;
      }
      if (req.query.fromPrice || req.query.toPrice) {
        const fromPrice = req.query.fromPrice || 0;
        const toPrice = req.query.toPrice || 999_999_999_999;
        params.filter.price_range = [fromPrice, toPrice];
      }

      return await this.findNftService.paginate(params);
    }));

    this.router.get('/findByTeam', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType: req.query.nftType
        }
      } as any;

      return await this.findNftService.paginateByTeam(params);
    }));

    this.router.get('/findByUser', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          nftType: req.query.nftType,
          isMedal: req.query.isMedal,
        }
      } as any;

      if (req.query.state) {
        params.filter.state = req.query.state;
      }

      return await this.findNftService.paginateByUser(user.walletID, params);
    }));

    this.router.get('/:id/getSignedTxMint', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const tokenAddress = req.query.tokenAddress;
      const { id } = req.params;

      return {
        data: await this.getSignedTxNftService.generateSignedTxMint(user.walletID, id, tokenAddress)
      };
    }));

    this.router.post('/:id/getSignedTxOffer', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return {
        data: await this.getSignedTxNftService.generateSignedTxOffer(user.walletID, nftId, nftType, req.body.listItemPrice,
          req.body.listTokenAddress)
      };
    }));

    this.router.get('/:id/getSignedTxWithdraw', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);
      return {
        data: await this.getSignedTxNftService.generateSignedTxWithdraw(user.walletID, nftId, nftType)
      };
    }));

    this.router.get('/:id/transactions', routeWrapper(async (req) => {
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType
        }
      } as any;

      return await this.findNftService.paginateTransactions(nftId, params);
    }));

    this.router.post('/:id/backToGame', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);
      const params = {
        filter: {
          type: nftType
        }
      };

      return await this.getNFTBackToGameService.process(user.walletID, nftId, params);
    }));

    this.router.get('/:id', (async (req, res, next) => {
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      if (Number(id)) {
        try {
          const rs = await this.findNftService.findOneByTokenId(id);
          return res.status(200).json(rs);
        } catch (error) {
          next(error);
        }
      }

      try {
        const rs = await this.findNftService.findOneByUser(nftId, {
          type: nftType
        });
        return res.status(200).json({
          data: rs.data,
          metadata: rs.metadata
        });
      } catch (error) {
        next(error);
      }
    }));

  }
}
