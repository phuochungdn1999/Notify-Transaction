import { EventInstance } from '@/interfaces/model/event';
import { BigNumber } from 'ethers';
import _ from 'lodash';
import GameServerService from '../gameServer.service';

export default class OpenNanoBoxService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const id = eventParams.id;
    let tokenIds = eventParams.tokenIds;
    tokenIds = _.map(tokenIds, (item) => {
      return BigNumber.from(item).toNumber();
    }
    );


    return await this.sendRequest({
      data: {
        action: 'OpenNanoBox',
        walletId: userAddress,
        tokenIds,
        txHash,
        id
      }
    });
  }
}
