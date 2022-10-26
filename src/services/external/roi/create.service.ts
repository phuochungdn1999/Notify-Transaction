import GameServerService from '../gameServer.service';

export default class CreateRoiService extends GameServerService {
  async create(params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'CreateRoi',
        ...params
      }
    });
  }
}
