import { EventInstance } from '@/interfaces/model/event';
import Price from '@/utils/price';
import { BigNumber } from 'ethers';
import GameServerService from '../gameServer.service';

export default class OfferMarketplaceService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;

    const id = eventParams.id;
    const itemType = eventParams.itemType;
    const nftType = eventParams.extraType;
    const walletId = eventParams.owner;
    const tokenAddress = eventParams.tokenAddress;
    const tokenId = BigNumber.from(eventParams.tokenId).toNumber();
    let priceList: Array<string> = [];
    // const price = Price.convetToEther(BigNumber.from(eventParams.price.map(i => Number(i))).toString());
    const price = Array(eventParams.price).map(i => {

      for (let k = 0; k < i.length; k++) {
        priceList.push(Price.convetToEther(BigNumber.from(i[k]).toString()));
      }
    });

    if (itemType.toUpperCase() == 'BOX') {
      return await this.sendRequest({
        data: {
          action: 'SetSellBox',
          id,
          state: 'MARKETPLACE',
          priceList,
          walletId,
          tokenId,
          tokenAddress,
          priceTokenType: 'NATIVE'
        }
      });
    }

    return await this.sendRequest({
      data: {
        action: 'SetSellNFT',
        id,
        nftType,
        state: 'MARKETPLACE',
        priceList,
        walletId,
        tokenId,
        tokenAddress,
        priceTokenType: 'NATIVE'
      }
    });
  }
}
