import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class FindDistanceService extends GameServerService {

  async getAll(date: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetAllDistance",
          date
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(404, "Distance is not found!", "NOT_FOUND");
    }
  }

}
