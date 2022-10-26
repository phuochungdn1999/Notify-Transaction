import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../services/external/gameServer.service';

export default class FindMaintenanceService extends GameServerService {

  async findOne(name: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "getConfigMaintenance",
          name
        },
      });
      return response.data;
    } catch (err) {
      throw new HttpException(400, "get config maintenance failed!", "SYSTEM_ERR");
    }
  }
}
