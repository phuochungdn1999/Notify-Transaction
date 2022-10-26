import { HttpException } from "@/exceptions/HttpException";
import FindNftsService from "@/services/external/nft/find.service";
import {
  getAllItemBlockchain
} from "@/utils/contract";
import { genSignature, genSignatureMarketplace } from "@/utils/signature";
import { BigNumber } from "ethers";
import { v4 as uuidv4 } from "uuid";
export default class GetSignedTxNftService {
  private findNftsService = new FindNftsService();

  async generateSignedTxMint(redeemer: string, refNftId: string, tokenAddress: any): Promise<any> {
    // TODO discuss findOneByUser with type
    const result = await this.findNftsService.findOneByUser(refNftId, {});
    const nft = result.data;
    const contracts = await getAllItemBlockchain();

    if (nft.soldBy || nft.walletId) {
      throw new HttpException(
        400,
        "This nft is invalid for minting",
        "INVALID_NFT_TYPE"
      );
    }

    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.NFTContract.address,
    };

    // Specific voucher structure
    const types = {
      NFTVoucher: [
        { name: "redeemer", type: "address" },
        { name: "itemId", type: "string" },
        { name: "itemClass", type: "string" },
        { name: "coinPrice", type: "uint256" },
        { name: "tokenPrice", type: "uint256" },
        { name: "tokenAddress", type: "address" },
        { name: "nonce", type: "string" },
      ],
    };

    const itemPriceFromAddress = nft?.listItemPrice.find(
      (ele: any) =>
        ele.tokenAddress?.toLowerCase() === tokenAddress?.toLocaleLowerCase()
    );
    if (!itemPriceFromAddress) {
      throw new Error("Token is not supported!");
    }
    nft.price = itemPriceFromAddress.price;

    // Generate nonce as transaction id
    const nonce = uuidv4();
    const tokenPrice = BigNumber.from(nft.price);
    // const tokenAddress = contract.GENI.address; // Hardcode for phase 1
    const voucher = {
      redeemer: redeemer,
      itemId: refNftId,
      itemClass: "nft",
      coinPrice: 0,
      tokenPrice,
      tokenAddress: tokenAddress,
      nonce: nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      tokenPrice: tokenPrice.toString(),
    };
  }

  async generateSignedTxOffer(
    seller: string,
    nftId: string,
    nftType: string,
    listItemPrice: any,
    listTokenAddress: any
  ): Promise<any> {
    // TODO discuss findOneByUser with type
    const result = await this.findNftsService.findOneByUser(nftId, {
      type: nftType,
    });
    const nft = result.data;
    const contracts = await getAllItemBlockchain();
    if (nft.walletId.toLowerCase() != seller.toLowerCase() || nft.isMedal) {
      throw new HttpException(
        400,
        "You can not offer this NFT",
        "INVALID_AUTH"
      );
    }

    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.marketplaceContract.address,
    };

    // Specific order structure
    const types = {
      OrderItemStruct: [
        { name: "walletAddress", type: "address" },
        { name: "id", type: "string" },
        { name: "itemType", type: "string" },
        { name: "extraType", type: "string" },
        { name: "tokenId", type: "uint256" },
        { name: "itemAddress", type: "address" },
        { name: "price", type: "uint256[]" },
        { name: "tokenAddress", type: "address[]" },
        { name: "nonce", type: "string" },
      ],
    };

    // Generate nonce as transaction id
    const nonce = uuidv4();
    const tokenId = BigNumber.from(nft.tokenId);
    const price = listItemPrice.map((i: any) => {
      return i?.toLocaleString("fullwide", { useGrouping: false });
    });
    const itemAddress = contracts.NFTContract.address;
    const orderItem = {
      walletAddress: seller,
      id: nftId,
      itemType: "nft",
      extraType: nftType,
      tokenId: tokenId,
      itemAddress: itemAddress,
      price: price,
      tokenAddress: listTokenAddress,
      nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignatureMarketplace(types, orderItem, auth)),
      tokenId: tokenId.toString(),
      itemPrice: price,
    };
  }

  async generateSignedTxDeposit(
    walletAddress: string,
    id: string,
    type: string
  ): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, { type });
    const item = result.data;
    const contracts = await getAllItemBlockchain();
    if (
      item.walletId.toLowerCase() != walletAddress.toLowerCase() ||
      item.state != "WALLET" || item.isMedal
    ) {
      throw new HttpException(
        400,
        "You can not deposit this NFT",
        "INVALID_AUTH"
      );
    }

    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.gameContract.address,
    };

    // Specific order structure
    const types = {
      DepositItemStruct: [
        { name: "id", type: "string" },
        { name: "itemAddress", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "itemType", type: "string" },
        { name: "extraType", type: "string" },
        { name: "nonce", type: "string" },
      ],
    };

    const nonce = uuidv4();
    const tokenId = BigNumber.from(item.tokenId);

    // Generate nonce as transaction id
    const voucher = {
      id: item.id,
      itemAddress: contracts.NFTContract.address,
      tokenId: tokenId,
      itemType: "nft",
      extraType: type,
      nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      tokenId: tokenId.toString(),
    };
  }
  async generateSignedTxWithdraw(
    withdrawer: string,
    id: string,
    type: string
  ): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, { type });
    const item = result.data;
    const contracts = await getAllItemBlockchain();
    if (
      item.walletId.toLowerCase() != withdrawer.toLowerCase() ||
      item.state === "WALLET"
    ) {
      throw new HttpException(
        400,
        "You can not withdraw this NFT",
        "INVALID_AUTH"
      );
    }
    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.gameContract.address,
    };

    // Specific voucher structure
    const types = {
      WithdrawItemStruct: [
        { name: "walletAddress", type: "address" },
        { name: "id", type: "string" },
        { name: "itemAddress", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "itemType", type: "string" },
        { name: "extraType", type: "string" },
        { name: "nonce", type: "string" },
      ],
    };

    // Generate nonce as transaction id
    const nonce = uuidv4();
    const tokenId = BigNumber.from(item.tokenId);

    const voucher = {
      walletAddress: withdrawer,
      id: item.id,
      itemAddress: contracts.NFTContract.address,
      tokenId: tokenId,
      itemType: "nft",
      extraType: type,
      nonce,
    };

    // Sign voucher and return
    return await genSignature(types, voucher, auth);
  }
}
