import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class RatioService extends GameServerService {

  async getRatio(tokenName: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetRatio",
          tokenName
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(404, "GetCaloriesBurned failed!", "SYSTEM_ERR");
    }
  }

}
