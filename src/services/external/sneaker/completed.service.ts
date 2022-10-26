import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class CompletedUpgradeService extends GameServerService {

  async completed(userId: string, itemId: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "UpgradeSneakerQuickCompleted",
          userId,
          itemId
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(500, "UpgradeSneakerQuickCompleted", "SYSTEM_ERROR");
    }
  }

}
