import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class PartnerService extends GameServerService {

  async createOrUpdatePartner(dataPartner: any, logo: string, logoNFT: string, walletAddress: string): Promise<any> {
    switch (dataPartner.idPartner ? true : false) {
      case true:
        try {
          const response = await this.sendRequest({
            data: {
              action: "UpdatePartner",
              dataPartner,
              logo,
              logoNFT,
              walletAddress
            },
          });
          return response;
        } catch (err) {
          throw new HttpException(400, "Update partner failed!", "SYSTEM_ERR");
        }
      case false:
        try {
          const response = await this.sendRequest({
            data: {
              action: "CreatePartner",
              dataPartner,
              logo,
              logoNFT,
              walletAddress
            },
          });

          return response;
        } catch (err) {
          throw new HttpException(400, "Create partner failed!", "SYSTEM_ERR");
        }
    }
  }

  async getListPartner(params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetListPartner",
          params
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(400, "Get list partner failed!", "SYSTEM_ERR");
    }
  }

  async getPartner(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetPartner",
          id
        },
      });
      return response;
    } catch (err) {
      throw new HttpException(400, "Get partner failed!", "SYSTEM_ERR");
    }
  }

  async updateNanoBoxPartner(idPartner: any, walletAddress: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "UpdateNanoBoxPartner",
          idPartner,
          walletAddress
        },
      });
      return response;
    } catch (err: any) {

      throw new HttpException(400, err.code, "SYSTEM_ERR");
    }
  }

}
