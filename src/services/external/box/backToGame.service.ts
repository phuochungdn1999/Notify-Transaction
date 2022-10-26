import GameServerService from '../gameServer.service';

export default class GetBoxBackToGameService extends GameServerService {
  async process(walletId: string, id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetBoxBackToGame',
        id: id,
        state: 'GAME',
        walletId: walletId,
        ...params
      }
    });
  }
}
