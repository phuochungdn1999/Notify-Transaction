import { Routes } from "@/interfaces/routes";
import FindDistanceService from '@/services/external/distance/find.service';
import { routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";

export class DistanceRoute implements Routes {
  public path = "/v1/distance";
  public router = Router();
  public findDistanceService = new FindDistanceService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      "/get-all/:key",
      routeWrapper(async (req, res) => {
        const { key } = req.params;
        const date = req.query.date;
        console.log("date: ", date);
        if (key && key == process.env.KEY_VERIFY) {
          const data = await this.findDistanceService.getAll(date);
          console.log({ data });
          res.send({ data });
        }
      })
    );
  }
}
