import GameServerService from '../gameServer.service';

export default class GetInfoUpgradeService extends GameServerService {
  async getInfo(id: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'UpgradeSneakerGetInfo',
        id
      }
    });
  }
}
