import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class TransferNFTService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const { from, to, tokenId } = eventParams;

    return await this.sendRequest({
      data: {
        action: 'TransferNFT',
        tokenId: tokenId,
        from: from,
        to: to,
        txHash,
      }
    });
  }
}
