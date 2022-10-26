import { HttpException } from '@/exceptions/HttpException';
import Price from '@/utils/price';
import _ from 'lodash';
import GameServerService from '../gameServer.service';

export default class FindBoxesService extends GameServerService {
  async paginateByTeam(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: "GetListTeamBox",
        ...params,
      },
    });

    for (const box of response.data) {
      box.weiPrice = Price.convertToWei(box.price);
    }

    return response;
  }

  async findOneByTeam(id: string, params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetTeamBoxDetail",
          ...params,
          id,
        },
      });

      response.data.weiPrice = Price.convertToWei(response.data.price);

      return response;
    } catch (err) {
      throw new HttpException(404, "Box is not found!", "NOT_FOUND");
    }
  }

  async findOneByTeamNotSoldOut(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetTeamBoxDetailIsNotSoldOut",
          id,
        },
      });

      response.data.weiPrice = Price.convertToWei(response.data.price);

      return response;
    } catch (err) {
      throw new HttpException(404, "Box is not found!", "NOT_FOUND");
    }
  }

  async paginateByMarket(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: "GetListUserBox",
        ...params,
      },
    });

    for (const box of response.data) {
      const boxPrice = box.price.toFixed(
        Number(box.price.toString().split("-")[1]) + 1
      );

      box.weiPrice = Price.convertToWei(
        box.price >= 1
          ? box.price
          : boxPrice == 0 || boxPrice == 1
            ? box.price
            : boxPrice
      );
    }

    return response;
  }

  async paginateByUser(walletAddress: string, params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: "GetListAccountBox",
        ...params,
      },
    });

    for (const box of response.data) {
      const boxPrice = box.price.toFixed(
        Number(box.price.toString().split("-")[1]) + 1
      );

      box.weiPrice = Price.convertToWei(
        box.price >= 1
          ? box.price
          : boxPrice == 0 || boxPrice == 1
            ? box.price
            : boxPrice
      );
    }

    return response;
  }

  async findOneByUser(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetUserBoxDetail",
          id,
        },
      });
      const boxPrice = response.data.price.toFixed(
        Number(response.data.price.toString().split("-")[1]) + 1
      );

      response.data.weiPrice = Price.convertToWei(
        response.data.price >= 1
          ? response.data.price
          : boxPrice == 0 || boxPrice == 1
            ? response.data.price
            : boxPrice
      );

      return response;
    } catch (err) {
      throw new HttpException(404, "Box is not found!", "NOT_FOUND");
    }
  }

  async paginateTransactions(id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: "GetBoxTransactions",
        id: id,
        ...params,
      },
    });
  }

  async findOpenedNewNfts(walletAddress: string, id: string): Promise<any> {
    try {
      const result = await this.sendRequest({
        data: {
          action: "GetNFTOpenBox",
          walletId: walletAddress,
          id: id,
        },
      });

      if (_.get(result, "data.length")) {
        return result;
      }
    } catch (err) { }

    return {
      data: null,
    };
  }

  async exportTxHashUserBox(partner?: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: "ExportTxHashPartner",
        params: partner,
      },
    });
  }

  async exportBuyTeamBoxHistories(params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: "ExportBuyTeamBoxHistories",
        ...params
      },
    });
  }

  async claimBoxPartner(walletId: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: "ClaimBoxPartner",
        params: walletId,
      },
    });
  }

  async getBoxPartner(walletId: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: "GetBoxPartner",
        params: walletId,
      },
    });
  }
}
