import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import PartnerService from '@/services/external/partner/partner.service';
import FindUsersService from '@/services/external/user/find.service';
import UpdateUserService from '@/services/external/user/update.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';
const uuid = require('uuid').v4;

export class PartnerRoute implements Routes {
  public path = '/v1/partner';
  public router = Router();
  public findUsersService = new FindUsersService();
  public updateUserService = new UpdateUserService();
  public partnerService = new PartnerService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(
    //   "/createOrUpdatePartner",
    //   upload.fields([{
    //     name: 'logo', maxCount: 1
    //   }, {
    //     name: 'logoNFT', maxCount: 1
    //   }]),
    //   passportAuthenticateJWT,
    //   routeWrapper(async (req: any) => {
    //     const user = req.user as UserInstance;
    //     let logoUrl: any;
    //     let logoNFTUrl: any;

    //     if (req.files.logo) {
    //       let logo = req.files.logo[0];
    //       const logoFileType = logo.originalname.split(".")[1];
    //       const logoFileName = uuid();
    //       uploadFile(logo, logoFileType, logoFileName);
    //       logoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${logoFileName}.${logoFileType}`;
    //     }
    //     if (req.files.logoNFT) {
    //       let logoNFT = req.files.logoNFT[0];
    //       const logoNFTFileType = logoNFT.originalname.split(".")[1];
    //       const logoNFTFileName = uuid();
    //       uploadFile(logoNFT, logoNFTFileType, logoNFTFileName);
    //       logoNFTUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${logoNFTFileName}.${logoNFTFileType}`;
    //     }

    //     return {
    //       data: await this.partnerService.createOrUpdatePartner(
    //         req.body, logoUrl, logoNFTUrl, user.walletID
    //       ),
    //     };
    //   })
    // );

    this.router.get(
      "/getListPartner",
      routeWrapper(async (req: any) => {
        const params = {
          limit: req.query.limit ? Number(req.query.limit) : 10,
          page: req.query.page ? Number(req.query.page) : 1,
          sort: req.query.sort ? req.query.sort : undefined,
          filter: {},
        } as any;

        if (req.query.search) {
          params.filter.search = req.query.search;
        }

        return await this.partnerService.getListPartner(params);

      })
    );

    this.router.get(
      "/:id/getPartner",
      routeWrapper(async (req: any) => {
        const { id } = req.params;

        return await this.partnerService.getPartner(id);

      })
    );

    this.router.post(
      "/updateNanoBoxPartner",
      passportAuthenticateJWT,
      routeWrapper(async (req: any) => {
        const { idPartner } = req.body;
        const user = req.user as UserInstance;
        return await this.partnerService.updateNanoBoxPartner(idPartner, user.walletID);

      })
    );
  }
}
