import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class FindDiscountCodeService extends GameServerService {

  async findOne(discountCode: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "getDiscountCodeDetail",
          discountCode
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(404, "GetDiscountCode failed!", "SYSTEM_ERR");
    }
  }

}
