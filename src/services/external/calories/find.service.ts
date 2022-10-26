import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class CaloriesBurnedService extends GameServerService {

  async getAll(date: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetCaloriesBurned",
          date
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(404, "GetCaloriesBurned failed!", "SYSTEM_ERR");
    }
  }

}
