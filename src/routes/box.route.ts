import { UserInstance } from "@/interfaces/model/user";
import { Routes } from "@/interfaces/routes";
import GetBoxBackToGameService from '@/services/external/box/backToGame.service';
import FindBoxesService from "@/services/external/box/find.service";
import UpdateBoxService from "@/services/external/box/update.service";
import GetSignedTxBoxService from "@/services/internal/box/getSignedTx.service";
import OpenBoxService from "@/services/internal/box/open.service";
import GetSignedTxNftService from "@/services/internal/nft/getSignedTx.service";
import Identifier from "@/utils/identifier";
import { passportAuthenticateJWT, routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";
import converter from "json-2-csv";

export class BoxRoute implements Routes {
  public path = "/v1/boxes";
  public router = Router();
  public findBoxService = new FindBoxesService();
  public getSignedTxNFTService = new GetSignedTxNftService();
  public getSignedTxBoxService = new GetSignedTxBoxService();
  public openBoxService = new OpenBoxService();
  public updateBoxService = new UpdateBoxService();
  public getBoxBackToGame = new GetBoxBackToGameService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/findByTeam",
      routeWrapper(async (req) => {
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
          sort: req.query.sort ? req.query.sort : undefined,
          filter: {},
        } as any;

        if (req.query.nftType) {
          params.filter.nftType = req.query.nftType;
        }

        if (req.query.typeBox) {
          //const listTypeBox = req.query.typeBox ? Array(req.query.typeBox) : undefined;
          params.filter.typeBox = req.query.typeBox;
        }

        if (req.query.rarity) {
          //const listTypeBox = req.query.typeBox ? Array(req.query.typeBox) : undefined;
          params.filter.rarity = req.query.rarity;
        }

        if (req.query.isSoldOut) {
          params.filter.isSoldOut = req.query.isSoldOut === "true";
        }

        if (req.query.isPartner) {
          params.filter.isPartner = req.query.isPartner === "true";
        }

        if (req.query.walletID) {
          params.filter.walletID = req.query.walletID;
        }

        return await this.findBoxService.paginateByTeam(params);
      })
    );

    this.router.get(
      "/findByMarket",
      routeWrapper(async (req) => {
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
          sort: req.query.sort ? req.query.sort : undefined,
          filter: {},
        } as any;

        if (req.query.nftType) {
          params.filter.nftType = req.query.nftType;
        }

        if (req.query.typeBox) {
          //const listTypeBox = req.query.typeBox ? Array(req.query.typeBox) : undefined;
          params.filter.typeBox = req.query.typeBox;
        }

        if (req.query.rarity) {
          //const listTypeBox = req.query.typeBox ? Array(req.query.typeBox) : undefined;
          params.filter.rarity = req.query.rarity;
        }

        if (req.query.walletId) {
          params.filter.walletId = req.query.walletId;
        }

        return await this.findBoxService.paginateByMarket(params);
      })
    );

    this.router.get(
      "/findByUser",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
          filter: {},
        } as any;

        if (req.query.state) {
          params.filter.state = req.query.state;
        }
        if (req.query.nftType) {
          params.filter.nftType = req.query.nftType;
        }

        return await this.findBoxService.paginateByUser(user.walletID, params);
      })
    );

    this.router.get(
      "/:id/findByTeam",
      routeWrapper(async (req) => {
        const { id } = req.params;
        const params = {
          filter: {},
        } as any;
        if (req.query.walletID) {
          params.filter.walletID = req.query.walletID;
        }
        return await this.findBoxService.findOneByTeam(id, params);
      })
    );

    this.router.get(
      "/:id/getSignedTxMint/:tokenAddress/:discountCode/:walletReferral",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id, tokenAddress, discountCode, walletReferral } = req.params;

        return {
          data: await this.getSignedTxBoxService.generateSignedTxMint(
            id,
            tokenAddress,
            discountCode,
            walletReferral,
            user?.walletID
          ),
        };
      })
    );

    this.router.post(
      "/:id/getSignedTxOffer",
      passportAuthenticateJWT,
      routeWrapper(async (req, res) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return {
          data: await this.getSignedTxBoxService.generateSignedTxOffer(
            user.walletID,
            id,
            req.body.listItemPrice,
            req.body.listTokenAddress
          ),
        };
      })
    );

    this.router.get(
      "/:id/getSignedTxDeposit",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        const [nftId, nftType] = Identifier.decode(id);
        if (nftType) {
          return {
            data: await this.getSignedTxNFTService.generateSignedTxDeposit(
              user.walletID,
              nftId,
              nftType
            ),
          };
        }

        return {
          data: await this.getSignedTxBoxService.generateSignedTxDeposit(
            user.walletID,
            id
          ),
        };
      })
    );

    this.router.get(
      "/:id/getSignedTxWithdraw",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return {
          data: await this.getSignedTxBoxService.generateSignedTxWithdraw(
            user.walletID,
            id
          ),
        };
      })
    );

    this.router.get(
      "/:id/transactions",
      routeWrapper(async (req) => {
        const { id } = req.params;
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
        } as any;

        return await this.findBoxService.paginateTransactions(id, params);
      })
    );

    this.router.post(
      "/:id/open",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return {
          data: await this.openBoxService.open(user.walletID, id),
        };
      })
    );

    this.router.get(
      "/:id/openedNewNfts",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return await this.findBoxService.findOpenedNewNfts(user.walletID, id);
      })
    );

    this.router.get(
      "/:id",
      routeWrapper(async (req) => {
        const { id } = req.params;

        return await this.findBoxService.findOneByUser(id);
      })
    );

    this.router.get(
      "/export/TxHashUserBox",
      routeWrapper(async (req) => {
        const { partner } = req.query;
        return await this.findBoxService.exportTxHashUserBox(partner as string);
      })
    );

    this.router.post(
      "/export/buyTeamBoxHistories",
      routeWrapper(async (req, res) => {
        const { startDate, endDate, discountCode, idWalletReferral, allRecordHaveDiscountCode, allRecordHaveidWalletReferral, allRecordHaveOr } = req.body;
        const params = {
          startDate,
          endDate,
          discountCode,
          idWalletReferral,
          allRecordHaveDiscountCode,
          allRecordHaveidWalletReferral,
          allRecordHaveOr
        } as any;

        const listBuyTeamBoxHistory = await this.findBoxService.exportBuyTeamBoxHistories(params);
        let csvData: any;
        await converter.json2csvAsync(listBuyTeamBoxHistory?.data).then(csv => {
          // print CSV string
          csvData = csv;
        }).catch(err => console.log(err));

        res.send(csvData);
      })
    );

    this.router.get(
      "/partner/claimBox",
      routeWrapper(async (req) => {
        const { walletId } = req.query;
        return await this.findBoxService.claimBoxPartner(walletId as string);
      })
    );

    this.router.get(
      "/partner/getBox",
      routeWrapper(async (req) => {
        const { walletId } = req.query;
        return await this.findBoxService.getBoxPartner(walletId as string);
      })
    );

    this.router.put(
      "/:id/update",
      passportAuthenticateJWT,
      routeWrapper(async (req, res) => {
        const user = req.user as UserInstance;
        const { id } = req.params;
        const params = {} as any;

        if (req.body.url) {
          params.url = req.body.url;
          const data = await this.updateBoxService.update(user.walletID, id, params);
          res.send({ data });
        }
      })
    );
    this.router.post('/:id/backToGame', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const params = {
      };

      return await this.getBoxBackToGame.process(user.walletID, id, params);
    }));

    this.router.get(
      "/:id/getSignedTxOpenNanoBox",
      passportAuthenticateJWT,
      routeWrapper(async (req) => {
        const user = req.user as UserInstance;
        const { id } = req.params;

        return {
          data: await this.getSignedTxBoxService.generateSignedTxOpenNanoBox(
            user.walletID,
            id
          ),
        };
      })
    );
  }
}
