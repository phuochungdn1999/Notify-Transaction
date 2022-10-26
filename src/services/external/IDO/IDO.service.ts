import { ContractName } from '@/config/eventSetting';
import { HttpException } from '@/exceptions/HttpException';
import { EventInstance } from '@/interfaces/model/event';
import { getAllItemBlockchain } from '@/utils/contract';
import Price from '@/utils/price';
import { genSignatureBuyIDO, genSignatureClaimIDO } from '@/utils/signature';
import { getTokenType } from '@/utils/tokenType';
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import GameServerService from '../gameServer.service';
dotenv.config({});

export default class saleIDOService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const user = eventParams.user;
    const nonce = eventParams.nonce;
    const tokenType = eventParams.isNativeToken ? 'NATIVE' : getTokenType(eventParams.tokenAddress);

    if (eventParams.tokenAddress != process.env.TOKEN_BUY_IDO_ADDRESS?.toLowerCase()) {
      return;
    }
    const amount = Price.convetToEther(eventParams.amount);
    let type;
    switch (event.contractName) {
      case ContractName.SeedSale:
        type = "seed";
        break;
      case ContractName.PublicSale:
        type = "public";
        break;
      case ContractName.PrivateSale:
        type = "private";
        break;
    }

    return await this.sendRequest({
      data: {
        action: 'UpdateOrderBuyIDO',
        walletId: user,
        txHash,
        tokenType,
        amount,
        type,
        nonce
      }
    });
  }

  async claimIDO(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const user = eventParams.user;
    const nonce = eventParams.nonce;
    const tokenType = eventParams.isNativeToken ? 'NATIVE' : getTokenType(eventParams.tokenAddress);

    if (eventParams.tokenAddress != process.env.TOKEN_CLAIM_IDO_ADDRESS?.toLowerCase()) {
      return;
    }
    const amount = Price.convetToEther(eventParams.amount);
    let type;
    switch (event.contractName) {
      case ContractName.SeedClaim:
        type = "seed";
        break;
      case ContractName.PublicClaim:
        type = "public";
        break;
      case ContractName.PrivateClaim:
        type = "private";
        break;
    }

    return await this.sendRequest({
      data: {
        action: 'ClaimIDO',
        walletId: user,
        txHash,
        tokenType,
        amount,
        type,
        nonce
      }
    });
  }

  async getListLaunchpad(params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetListLaunchpad",
          params
        },
      });
      return response;
    } catch (err: any) {

      throw new HttpException(400, err.message, err.code);
    }
  }

  async getLaunchpad(id: any, walletAddress: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: "GetLaunchpad",
          id,
          walletAddress
        },
      });
      return response;
    } catch (err: any) {
      throw new HttpException(400, err.message, err.code);
    }
  }

  async getSignedTxBuyIDO(launchpadId: any, tokenAddress: string, receiver: string, amount: number, type: string) {
    try {
      const tokenType = getTokenType(tokenAddress?.toLowerCase());
      const contracts = await getAllItemBlockchain();
      if (tokenAddress?.toLowerCase() != process.env.TOKEN_BUY_IDO_ADDRESS?.toLowerCase()) {
        throw new HttpException(400, "Token not allowed to buy IDO!", "INVALID_TOKEN_ADDESS");
      }
      let auth: any;
      const userOrder = await this.sendRequest({
        data: {
          action: 'BuyIDO',
          walletId: receiver,
          tokenType,
          amount,
          launchpadId
        }
      });
      if (!userOrder.data) {
        throw new HttpException(400, "Some thing went wrong!", "UNKNOW_ERROR");
      }
      // Authenticator for voucher
      switch (type?.toLowerCase()) {
        case "seed":
          auth = {
            signer: contracts.deployer,
            contract: contracts.seedSaleContract.address,
          };
          break;
        case "public":
          auth = {
            signer: contracts.deployer,
            contract: contracts.publicSaleContract.address,
          };
          break;
        case "private":
          auth = {
            signer: contracts.deployer,
            contract: contracts.privateSaleContract.address,
          };
          break;
      }
      // Specific order structure
      const types = {
        BuyStruct: [
          { name: "amount", type: "uint256" },
          { name: "receiver", type: "address" },
          { name: "tokenAddress", type: "address" },
          { name: "nonce", type: "string" },
        ],
      };

      // Generate nonce as transaction id
      const voucher = {
        amount: Price.convertToWei(userOrder?.data?.valueOfBlock),
        receiver: userOrder?.data?.walletId,
        tokenAddress,
        nonce: userOrder?.data?.nonce,
      };

      // Sign voucher and return
      return {
        tx: await genSignatureBuyIDO(types, voucher, auth),
        isPending: userOrder.data.isPending
      };
    } catch (error: any) {
      throw new HttpException(400, error.message, error.code);
    }
  }

  async deleteOrderBuyIDO(id: string, walletAddress: string) {
    return await this.sendRequest({
      data: {
        action: 'DeleteOrderBuyIDO',
        id,
        walletAddress
      }
    });
  }

  async getSignedTxClaimIDO(launchpadId: any, tokenAddress: string, receiver: string, type: string) {
    try {
      // const tokenType = getTokenType(tokenAddress?.toLowerCase());
      const contracts = await getAllItemBlockchain();
      if (tokenAddress?.toLowerCase() != process.env.TOKEN_CLAIM_IDO_ADDRESS?.toLowerCase()) {
        throw new HttpException(400, "Token not allowed to claim IDO!", "INVALID_TOKEN_ADDESS");
      }
      let auth: any;
      const userLaunchpadInfomation = await this.getLaunchpad(launchpadId, receiver);
      if (!userLaunchpadInfomation.data) {
        throw new HttpException(400, "Some thing went wrong!", "UNKNOW_ERROR");
      }

      // Authenticator for voucher
      switch (type?.toLowerCase()) {
        case "seed":
          auth = {
            signer: contracts.deployer,
            contract: contracts.seedClaimContract.address,
          };
          break;
        case "public":
          auth = {
            signer: contracts.deployer,
            contract: contracts.publicClaimContract.address,
          };
          break;
        case "private":
          auth = {
            signer: contracts.deployer,
            contract: contracts.privateClaimContract.address,
          };
          break;
      }
      // Specific order structure
      const types = {
        ClaimStruct: [
          { name: "amount", type: "uint256" },
          { name: "month", type: "uint256[]" },
          { name: "receiver", type: "address" },
          { name: "tokenAddress", type: "address" },
          { name: "nonce", type: "string" },
        ],
      };

      // const roundList = userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.roundReadyToClaim.map((i: any) => {
      //   return i?.toLocaleString("fullwide", { useGrouping: false });
      // });

      const amountClaim = userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.totalClaimable - userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.totalClaimed;
      // const month = userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.roundReadyToClaim[userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.roundReadyToClaim.length - 1] ?? null;

      if (!amountClaim || amountClaim <= 0) {
        throw new HttpException(400, "Invalid amount claim!", "INVALID_AMOUNT_CLAIM");
      }

      //Generate nonce as transaction id
      const voucher = {
        amount: Price.convertToWei(100),
        month: userLaunchpadInfomation?.data?.extendDataUserLaunchpad?.roundReadyToClaim,
        receiver,
        tokenAddress,
        nonce: uuidv4(),
      };

      // Sign voucher and return
      return {
        tx: await genSignatureClaimIDO(types, voucher, auth),
      };
    } catch (error: any) {
      throw new HttpException(400, error.message, error.code);
    }
  }
}
