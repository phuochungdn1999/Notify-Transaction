import { Routes } from '@/interfaces/routes';
import IndexService from '@/services/index';
import { Router } from 'express';
import { WalletRoute } from './wallet.route';

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
  new WalletRoute()
];

export default routes;
