import { ContractName, EventName } from "@/config/eventSetting";
import {
  getAllItemBlockchain
} from "@/utils/contract";

export default class BaseEventService {
  logPath(): string {
    return this.constructor.name;
  }

  async buildParams(event: any) {
    let params: any;
    const contracts = await getAllItemBlockchain();
    if (event.event === EventName.DepositItem) {
      params = {
        id: event.args.id,
        user: event.args.user.toLowerCase(),
        itemAddress: event.args.itemAddress.toLowerCase(),
        tokenId: event.args.tokenId.toString(),
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.WithdrawItem) {
      params = {
        id: event.args.id,
        extraType: event.args.extraType,
        user: event.args.user.toLowerCase(),
        itemType: event.args.itemType,
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.Transfer) {
      if (
        event.args.from.toLowerCase() ===
        "0x0000000000000000000000000000000000000000" ||
        event.args.to.toLowerCase() === contracts.gameContract.address.toLowerCase() ||
        event.args.to.toLowerCase() === contracts.NFTContract.address.toLowerCase() ||
        event.args.to.toLowerCase() ===
        contracts.marketplaceContract.address.toLowerCase()
      ) {
        params = undefined;
      } else {
        params = {
          from: event.args.from.toLowerCase(),
          to: event.args.to.toLowerCase(),
          tokenId: parseInt(event.args.tokenId),
        };
      }
    }

    if (event.event === EventName.DepositToken) {
      params = {
        user: event.args.user.toLowerCase(),
        isNativeToken: event.args.isNativeToken,
        tokenAddress: event.args.tokenAddress.toLowerCase(),
        amount: event.args.amount.toString(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.WithdrawToken) {
      params = {
        user: event.args.user.toLowerCase(),
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.Redeem) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: event.args.tokenId,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.MintFromGame) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: parseInt(event.args.tokenId),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.OpenStarterBox) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        tokenIds: event.args.tokenIds,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.Offer) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: event.args.tokenId,
        owner: event.args.owner.toLowerCase(),
        price: event.args.price,
        tokenAddress: event.args.tokenAddress,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.Buy) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: event.args.tokenId,
        owner: event.args.owner.toLowerCase(),
        price: event.args.price.toString(),
        buyer: event.args.buyer.toLowerCase(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.Withdraw) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: event.args.tokenId,
        owner: event.args.owner.toLowerCase(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.OpenNanoBox) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        tokenIds: event.args.tokenIds,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.DepositItemFromNFT) {
      params = {
        id: event.args.id,
        user: event.args.user.toLowerCase(),
        itemAddress: event.args.itemAddress.toLowerCase(),
        tokenId: event.args.tokenId.toString(),
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.BuyIDO) {
      params = {
        user: event.args.user.toLowerCase(),
        tokenAddress: event.args.tokenAddress.toLowerCase(),
        amount: event.args.amount.toString(),
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    if (event.event === EventName.ClaimIDO) {
      params = {
        user: event.args.user.toLowerCase(),
        tokenAddress: event.args.tokenAddress.toLowerCase(),
        amount: event.args.amount.toString(),
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000,
      };
    }

    return params;
  }

  async getContractName(address: string) {
    const contracts = await getAllItemBlockchain();
    switch (address.toLowerCase()) {
      case contracts.gameContract.address.toLowerCase():
        return ContractName.Game;

      case contracts.NFTContract.address.toLowerCase():
        return ContractName.NFT;

      case contracts.marketplaceContract.address.toLowerCase():
        return ContractName.Marketplace;

      case contracts.seedSaleContract.address.toLowerCase():
        return ContractName.SeedSale;

      case contracts.privateSaleContract.address.toLowerCase():
        return ContractName.PrivateSale;

      case contracts.publicSaleContract.address.toLowerCase():
        return ContractName.PublicSale;

      case contracts.seedClaimContract.address.toLowerCase():
        return ContractName.SeedClaim;

      case contracts.privateClaimContract.address.toLowerCase():
        return ContractName.PrivateClaim;

      case contracts.publicClaimContract.address.toLowerCase():
        return ContractName.PublicClaim;
    }
  }
}
