import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class FindTokensService extends GameServerService {
  async findOneTransaction(id: string, walletId: string): Promise<any> {
    try {
      return await this.sendRequest({
        data: {
          action: 'GetTokenTransactionDetail',
          walletId,
          id
        }
      });
    } catch (err) {
      throw new HttpException(404, 'Token transaction is not found!', 'NOT_FOUND');
    }
  }

  async paginateWithdrawHistories(walletAddress: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: 'GetTokenTransactions',
        ...params
      }
    });
  }

  async paginateDepositHistories(walletAddress: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: 'GetTokenTransactions',
        ...params
      }
    });
  }

  async updateStatusClaim(userWalletId: string, id: string): Promise<any> {
    return await this.sendRequest({
      data: {
        userWalletId,
        id,
        action: 'updateStatusClaim',
      }
    });
  }

  async backToGame(userWalletId: string, id: string): Promise<any> {
    return await this.sendRequest({
      data: {
        userWalletId,
        id,
        action: 'BringTokenBackToGame',
      }
    });
  }
}
