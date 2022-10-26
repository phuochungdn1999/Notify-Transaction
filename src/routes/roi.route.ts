import { Routes } from "@/interfaces/routes";
import CreateRoiService from '@/services/external/roi/create.service';
import FindRoiService from '@/services/external/roi/find.service';
import { routeWrapper } from "@utils/routerWrapper";
import { Router } from "express";

export class RoiRoute implements Routes {
  public path = "/v1/roi";
  public router = Router();
  public findRoiService = new FindRoiService();
  public createRoiService = new CreateRoiService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(
      "/:id",
      routeWrapper(async (req, res) => {
        const { id } = req.params;
        const data = await this.findRoiService.findById(id);
        res.send({ data });
      })
    );

    this.router.post(
      "/create",
      routeWrapper(async (req, res) => {
        if (req.body) {
          const data = await this.createRoiService.create(req.body);
          res.send({ id: data.id });
        }
      })
    );
  }
}
