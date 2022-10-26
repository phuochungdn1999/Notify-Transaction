import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class UpgradeService extends GameServerService {

  async upgrade(userId: string, itemId: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "UpgradeSneaker",
          userId,
          itemId
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(500, "UpgradeSneaker Error", "SYSTEM_ERR");
    }
  }

}
