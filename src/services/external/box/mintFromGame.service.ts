import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class MintFromGameService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const id = eventParams.id;
    const itemType = eventParams.itemType;
    const extraType = eventParams.extraType;
    const tokenId = eventParams.tokenId;

    return await this.sendRequest({
      data: {
        action: 'MintFromGame',
        walletId: userAddress,
        itemType,
        extraType,
        tokenId,
        txHash,
        id
      }
    });
  }
}
