import { Routes } from '@/interfaces/routes';
import { MessageRoute } from '@/routes/message.route';
import IndexService from '@/services/index';
import { Router } from 'express';
import { AwsRoute } from './aws.route';
import { BoxRoute } from './box.route';
import { CaloriesRoute } from './calories.route';
import { ConfigRoute } from './config.route';
import { DiscountCodeRoute } from './discountCode.route';
import { DistanceRoute } from './distance.route';
import { LaunchpadRoute } from './launchpad.route';
import { NftRoute } from './nft.route';
import { PartnerRoute } from './partner.router';
import { PriceRoute } from './price.route';
import { RoiRoute } from './roi.route';
import { TokenRoute } from './token.route';
import { UpgradeSneakerRoute } from './upgrade.route';
import { UserRoute } from './user.route';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  private indexService = new IndexService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) => {
      try {
        res.status(200).json(this.indexService.hello());
      } catch (error) {
        next(error);
      }
    });
  }
}

const routes: Routes[] = [
  new IndexRoute(),
  new MessageRoute(),
  new NftRoute(),
  new BoxRoute(),
  new TokenRoute(),
  new ConfigRoute(),
  new PriceRoute(),
  new UserRoute(),
  new RoiRoute(),
  new AwsRoute(),
  new DistanceRoute(),
  new UpgradeSneakerRoute(),
  new CaloriesRoute(),
  new DiscountCodeRoute(),
  new PartnerRoute(),
  new LaunchpadRoute(),
];

export default routes;
