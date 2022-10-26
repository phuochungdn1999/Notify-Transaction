import { HttpException } from '@/exceptions/HttpException';
import Identifier from '@/utils/identifier';
import Price from '@/utils/price';
import GameServerService from '../gameServer.service';

export default class FindNftsService extends GameServerService {
  async paginate(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: 'GetListUserNFT',
        ...params
      }
    });

    for (const nft of response.data) {
      nft.id = Identifier.encode(nft.id, nft.nftType);
      const nftPrice = nft.price.toFixed(Number(nft.price.toString().split('-')[1]) + 1);
      nft.weiPrice = Price.convertToWei(nft.price >= 1 ? nft.price : (nftPrice == 0 || nftPrice == 1 ? nft.price : nftPrice));
    }

    return response;
  }

  async paginateByTeam(params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetListTeamNFT',
        ...params
      }
    });
  }

  async paginateByUser(userAddress: string, params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        walletId: userAddress,
        action: 'GetListAccountNFT',
        ...params
      }
    });

    for (const nft of response.data) {
      nft.id = Identifier.encode(nft.id, nft.nftType);
      const nftPrice = nft.price.toFixed(Number(nft.price.toString().split('-')[1]) + 1);
      nft.weiPrice = Price.convertToWei(nft.price >= 1 ? nft.price : (nftPrice == 0 || nftPrice == 1 ? nft.price : nftPrice));
    }

    return response;
  }

  async findOneByUser(id: string, params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: 'GetUserNFTDetail',
          id,
          ...params
        }
      });

      console.log(response);


      const nftPrice = response.data.price.toFixed(Number(response.data.price.toString().split('-')[1]) + 1);

      response.data.weiPrice = Price.convertToWei(response.data.price >= 1 ? response.data.price : (nftPrice == 0 || nftPrice == 1 ? response.data.price : nftPrice));

      return response;
    } catch (err) {
      throw new HttpException(404, 'Item is not found!', 'NOT_FOUND');
    }
  }

  async findOneByTokenId(tokenId: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: 'GetNFTByTokenId',
          tokenId
        }
      });

      return response;
    } catch (err) {
      throw new HttpException(404, 'Item is not found!', 'NOT_FOUND');
    }
  }

  async paginateTransactions(id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetNFTTransactions',
        id: id,
        ...params
      }
    });
  }
}
