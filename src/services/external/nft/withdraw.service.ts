import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class WithdrawNFTService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const { tokenId, walletId, extraType, id } = eventParams;

    return await this.sendRequest({
      data: {
        walletId: walletId,
        action: 'WithdrawNFT',
        id,
        tokenId,
        txHash,
        nftType: extraType
      }
    });
  }
}
