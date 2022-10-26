import { feeConfig } from '@/config/feeConfig';
import FindMaintenanceService from '@/config/maintenance';
import { marketplaceConfig } from '@/config/marketplaceConfig';
import { Routes } from '@/interfaces/routes';
import { routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class ConfigRoute implements Routes {
  public path = '/v1/configs';
  public router = Router();

  public findMaintenanceService = new FindMaintenanceService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', routeWrapper((req) => {
      return {
        data: {
          feeConfig,
          marketplaceConfig
        }
      };
    }));

    this.router.get('/maintenance/:name', routeWrapper(async (req) => {
      const { name } = req.params;
      return {
        data: await this.findMaintenanceService.findOne(name)
      };
    }));
  }
}
