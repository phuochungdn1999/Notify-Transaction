import { Routes } from '@/interfaces/routes';
import FindUsersService from '@/services/external/user/find.service';
import UpdateUserService from '@/services/external/user/update.service';
import CheckDiscountCodeService from '@/services/internal/discountCode/checkDiscountCode.service';
import { routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class DiscountCodeRoute implements Routes {
  public path = '/v1/discountCodes';
  public router = Router();
  public findUsersService = new FindUsersService();
  public updateUserService = new UpdateUserService();
  public checkDiscountCode = new CheckDiscountCodeService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/checkDiscountCode/:discountCode",
      routeWrapper(async (req) => {
        const { discountCode } = req.params;

        return {
          data: await this.checkDiscountCode.checkDiscountCode(
            discountCode
          ),
        };
      })
    );
  }
}
