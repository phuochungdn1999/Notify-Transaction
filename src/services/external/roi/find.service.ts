import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class FindRoiService extends GameServerService {

  async findById(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetRoiDetail",
          id,
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(404, "ROI is not found!", "NOT_FOUND");
    }
  }

}
