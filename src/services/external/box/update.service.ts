import FindBoxesService from '@/services/external/box/find.service';
import GameServerService from '../gameServer.service';

export default class UpdateBoxService extends GameServerService {
  private findBoxesService = new FindBoxesService;
  async update(walletAddress: string, id: string, params: any): Promise<any> {
    // const result = await this.FindS.findOneByUser(id);
    // const item = result.data;
    // if (item.walletId.toLowerCase() != walletAddress.toLowerCase()) {
    //   throw new HttpException(400, 'This box is invalid for opening', 'INVALID_BOX_TYPE');
    // }
    return await this.sendRequest({
      data: {
        action: 'UploadSneaker',
        walletId: walletAddress,
        id: id,
        ...params
      }
    });
  }

}
