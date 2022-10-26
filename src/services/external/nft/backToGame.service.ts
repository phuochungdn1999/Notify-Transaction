import GameServerService from '../gameServer.service';

export default class GetNFTBackToGameService extends GameServerService {
  async process(walletId: string, id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetNFTBackToGame',
        id: id,
        state: 'GAME',
        walletId: walletId,
        ...params
      }
    });
  }
}
