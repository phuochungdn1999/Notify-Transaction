import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class DepositNFTService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const { tokenId, user, extraType, id } = eventParams;
    
    await this.sendRequest({
      data: {
        walletId: user,
        action: 'DepositNFT',
        id,
        tokenId,
        txHash,
        nftType: extraType
      }
    });
  }
}
