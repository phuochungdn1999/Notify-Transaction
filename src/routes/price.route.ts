import { Routes } from '@/interfaces/routes';
import GetRateExchangeService from '@/services/internal/price/getRateExchange.service';
import { routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class PriceRoute implements Routes {
  public path = '/v1/prices';
  public router = Router();
  public getRateExchangeService = new GetRateExchangeService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/rate-exchange/USDT', routeWrapper(async (req) => {
      const { price } = req.query;

      return {
        data: await this.getRateExchangeService.getRateExchangeWithUsdt(String(price))
      };
    }));

    this.router.get('/rate-exchange/:id', routeWrapper(async (req) => {
      const { price } = req.query;
      const { id } = req.params;

      return {
        data: await this.getRateExchangeService.getRateExchangeToken(
          String(price),
          id
        ),
      };
    }));

    this.router.get('/rate-exchange/v2/:id', routeWrapper(async (req) => {
      const { price } = req.query;
      const { id } = req.params;

      return {
        data: await this.getRateExchangeService.getRateExchangeToken(
          String(price),
          id
        ),
      };
    }));

    // this.router.get('/rate-exchange/BNB', routeWrapper(async (req) => {
    //   const { price } = req.query;

    //   return {
    //     data: await this.getRateExchangeService.getRateExchangeFromBNBtoUSDT(String(price))
    //   };
    // }));

    // this.router.get('/rate-exchange/NATIVE', routeWrapper(async (req) => {
    //   const { price } = req.query;

    //   return {
    //     data: await this.getRateExchangeService.getRateExchangeFromBNBtoUSDT(String(price))
    //   };
    // }));

    this.router.get('/rate-exchange/RUNNOW', routeWrapper(async (req) => {
      const { price } = req.query;

      return {
        data: await this.getRateExchangeService.getRateExchangeWithRunnow(String(price))
      };
    }));

    this.router.get('/rate-exchange/GENI', routeWrapper(async (req) => {
      const { price } = req.query;

      return {
        data: await this.getRateExchangeService.getRateExchangeWithGeni(String(price))
      };
    }));
  }
}
