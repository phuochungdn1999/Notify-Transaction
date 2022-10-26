import { Routes } from "@/interfaces/routes";
import CaloriesBurnedService from '@/services/external/calories/find.service';
import { routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";

export class CaloriesRoute implements Routes {
  public path = "/v1/calories";
  public router = Router();
  public caloriesBurnedService = new CaloriesBurnedService();

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
          const data = await this.caloriesBurnedService.getAll(date);
          console.log({ data });
          res.send({ data });
        }
      })
    );
  }
}
