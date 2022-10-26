import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class CreateBuyTeamBoxHistoryService extends GameServerService {

  async create(params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "createBuyTeamBoxHistory",
          ...params
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(400, "CreateBuyTeamBoxHistory failed!", "SYSTEM_ERR");
    }
  }

}
