/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException } from "@/exceptions/HttpException";
import FindBoxService from "@/services/external/box/find.service";
import CreateBuyTeamBoxHistoryService from '@/services/external/buyTeamBoxHistory/create.service';
import FindDiscountCodeService from '@/services/external/discountCode/find.service';
import PartnerService from '@/services/external/partner/partner.service';
import FindUsersService from '@/services/external/user/find.service';
import { logger } from "@/svlogs/Logger";
import {
  getAllItemBlockchain
} from "@/utils/contract";
import { getDiscountInfo } from "@/utils/discount";
import Price from "@/utils/price";
import { genSignature, genSignatureMarketplace } from "@/utils/signature";
import { BigNumber, utils } from "ethers";
import fs from "fs";
import moment from "moment";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default class GetSignedTxBoxService {
  private findBoxService = new FindBoxService();
  private findDiscountCodeService = new FindDiscountCodeService();
  private createBuyTeamBoxHistory = new CreateBuyTeamBoxHistoryService();
  private findUsersService = new FindUsersService();
  public partnerService = new PartnerService();

  async toJsonDataPartner(csv: any) {
    const lines = csv.split("\n").filter((l: any) => l);
    const headers = lines[0].split(",");
    lines.shift();
    const result = [] as any;

    lines.map((l: string) => {
      const obj = {} as any;
      const line = l.split(",") as any;

      headers.map((h: string | number, i: string | number) => {
        obj[h] = line[i];
      });

      result.push(obj);
    });

    return JSON.stringify(result);
  }

  async mintNFTtoPartners() {
    try {
      // const contracts = await getAllItemBlockchain()
      const mintLimit = Number(process.env.MINT_LIMIT) || 100;
      const csvFile = fs
        .readFileSync(path.resolve(__dirname, "partner.csv"))
        .toLocaleString();
      const boxFile = fs
        .readFileSync(path.resolve(__dirname, "box.csv"))
        .toLocaleString();
      const filterFile = fs.readFileSync(__dirname + "/filter.json", "utf8");

      const readDateCSV = await this.toJsonDataPartner(csvFile);
      const readBoxJson = await this.toJsonDataPartner(boxFile);

      const dataPartner = JSON.parse(readDateCSV);
      const filterJson = JSON.parse(filterFile) as any;
      const dataBoxInput = JSON.parse(readBoxJson);

      const filterInput = {} as any;
      Object.keys(filterJson).map((f) => {
        filterInput[f] = filterJson[f];
        // if (filterJson[f]) {
        // }
      });
      const amountBoxArr = dataPartner.map(
        (b: { boxAmount: any; }) => b.boxAmount
      );
      const total = amountBoxArr.reduce(
        (a: any, b: any) => Number(a) + Number(b),
        0
      );
      let params = {
        filter: {
          isSoldOut: false,
          isPartner: true,
          partner: dataPartner[0].partnerId,
        },
        limit: 1000,
      };
      process.stdout.write(
        `Select 1 if you want mint from partner csv no filter, Select 2 if you want to apply filter, select 3 if you want to apply csv file mint 1/2 \n`
      );
      process.stdin.on("data", async (data) => {
        if (data.toString().trim() === "1") {
          const arrBoxes = await this.findBoxService.paginateByTeam({
            ...params,
            limit: total,
          });
          const dataBox1 = arrBoxes.data;
          if (arrBoxes.metadata.total < total) {
            throw new Error("Not enough box to mint");
          }
          await this.excutedMint(total, dataPartner, mintLimit, dataBox1);
        }
        if (data.toString().trim() === "2") {
          params = {
            filter: {
              ...filterInput,
              isSoldOut: false,
            },
            limit: total,
          };
          const arrBoxes = await this.findBoxService.paginateByTeam({
            ...params,
            limit: total,
          });
          const dataBox2 = arrBoxes.data;
          if (arrBoxes.metadata.total < total) {
            throw new Error("Not enough box to mint");
          }
          await this.excutedMint(total, dataPartner, mintLimit, dataBox2);
        } else if (data.toString().trim() === "3") {
          const arrBoxInput = dataBoxInput.map((d: any) => d.boxId);
          const seen = new Set();
          const duplicates = arrBoxInput.filter(
            (n: unknown) => seen.size === seen.add(n).size
          );
          if (duplicates.length > 0) {
            throw new Error("Fail mint: duplicate box to mint");
          }
          const arrBoxTotalMint = arrBoxInput.slice(0, total);
          const dataBox3 = await Promise.all(
            arrBoxTotalMint.map(async (b: string) => {
              const res = await this.findBoxService.findOneByTeamNotSoldOut(b);
              return res.data;
            })
          );
          await this.excutedMint(total, dataPartner, mintLimit, dataBox3);
        }
      });
    } catch (error) {
      console.log(error, "ERROR");
    }
  }

  async excutedMint(total: any, dataPartner: any, mintLimit: any, dataBox: any) {
    console.table(dataBox, ['name', 'nftSubTypes1', 'nftSubTypes2', 'isSoldOut', 'properties', 'price']);
    const contracts = await getAllItemBlockchain();
    const wallets = [] as any;
    dataPartner.map((item: any) => {
      for (let index = 0; index < Number(item.boxAmount); index++) {
        if (utils.getAddress(item.walletId)) {
          wallets.push(item.walletId);
        }
      }
    });
    const ids = dataBox.map((i: any) => i.id);
    const itemTypes = dataBox.map((i: any) => i.type);
    const extraTypes = dataBox.map((i: any) => i.nftTypes[0]);
    const nonces = dataBox.map((i: any) => i.nonce);
    process.stdout.write(
      `Are you sure you want to mint boxes for partner y/n \n`
    );
    process.stdin.on("data", async (data) => {
      if (data.toString().trim() === "y") {
        for (let index = 0; index < total / mintLimit; index++) {
          console.log(wallets, "wallets");
          const rs = await contracts.NFTContractMint.mintBatch(
            wallets.splice(0, mintLimit),
            ids.splice(0, mintLimit),
            itemTypes.splice(0, mintLimit),
            extraTypes.splice(0, mintLimit),
            nonces.splice(0, mintLimit)
          );
          await rs.wait();
          const messageLog = `[${moment().format("DD-MM-YYYY HH:mm:ss")}]`;

          logger.info("mintBox", {
            message: messageLog,
            data: {
              txHash: rs.hash,
              contract: rs.to,
            },
          });
        }
      }
    });
  }

  async testContractFunction() {
    const contracts = await getAllItemBlockchain();
    await contracts.NFTContract.provider.getBlockNumber();
    contracts.NFTContract.signer.getBalance();
  }

  async generateSignedTxMint(
    id: string,
    tokenAddress: string,
    discountCode: string,
    walletReferral: string,
    userWalletId: string
  ): Promise<any> {
    const contracts = await getAllItemBlockchain();
    const params = {
      filter: {},
    } as any;
    if (userWalletId) {
      params.filter.walletID = userWalletId;
    }
    const result = await this.findBoxService.findOneByTeam(id, params);
    const item = result.data;
    let discountCodeDetail: any;

    if (discountCode.toUpperCase() !== "NULL") {
      discountCodeDetail = await this.findDiscountCodeService.findOne(
        discountCode
      );
    }

    if (item.isSoldOut || item.isComing || item.walletId) {
      throw new HttpException(
        400,
        "This box is invalid for minting",
        "INVALID_BOX_TYPE"
      );
    }

    if (userWalletId.toLowerCase() === walletReferral.toLowerCase()) {
      throw new HttpException(400, "Referal invalid", "INVALID_REFERRAL");
    }

    if (discountCodeDetail) {
      if (
        discountCodeDetail?.data.status === "COMMING" ||
        discountCodeDetail?.data.status === "EXPIRED"
      ) {
        throw new HttpException(
          400,
          `This discount code is ${discountCodeDetail?.data.status.toLowerCase()}`,
          "INVALID_DISCOUNT_CODE"
        );
      }
    }

    await this.createBuyTeamBoxHistory.create({
      itemId: item.id,
      walletId: userWalletId,
      walletReferral:
        walletReferral?.toUpperCase() === "NULL" ? "" : walletReferral,
      discountCode: discountCode?.toUpperCase() === "NULL" ? "" : discountCode,
      nonce: item.nonce,
    });

    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.NFTContract.address,
    };

    // Specific voucher structure
    const types = {
      ItemVoucherStruct: [
        { name: "id", type: "string" },
        { name: "itemType", type: "string" },
        { name: "extraType", type: "string" },
        { name: "price", type: "uint256" },
        { name: "tokenAddress", type: "address" },
        { name: "receiver", type: "address" },
        { name: "nonce", type: "string" },
      ],
    };

    const itemPriceFromAddress = item?.listItemPrice.find(
      (ele: any) =>
        ele.tokenAddress?.toLowerCase() === tokenAddress?.toLocaleLowerCase()
    );
    if (!itemPriceFromAddress) {
      throw new Error("Token is not supported!");
    }
    item.price = itemPriceFromAddress.price;
    // Generate nonce as transaction id
    const discountInfo = getDiscountInfo(item);

    const discountPrice = discountInfo.amount
      ? (
        Number(item.price) -
        (Number(discountInfo.amount) * Number(item.price)) / 100
      ).toString()
      : item.price;

    const boxPrice = Number(discountPrice).toFixed(
      Number(discountPrice.toString().split("-")[1]) + 1
    );

    const itemPrice = BigNumber.from(
      Price.convertToWei(
        discountPrice >= 1
          ? discountPrice
          : Number(boxPrice) == 0 || Number(boxPrice) == 1
            ? discountPrice
            : boxPrice
      )
    );

    const voucher = {
      id: item.id,
      itemType: "box",
      extraType: "",
      price: itemPrice,
      tokenAddress,
      receiver: userWalletId,
      nonce: item.nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      price: itemPrice.toString(),
    };
  }

  async generateSignedTxOpenBox(
    walletAddress: string,
    id: string,
    nonce: string,
    tokenId: number,
    nftNum: number
  ): Promise<any> {
    const contracts = await getAllItemBlockchain();
    // Authenticator for voucher
    const auth = {
      signer: contracts.deployer,
      contract: contracts.NFTContract.address,
    };

    // Specific voucher structure
    const types = {
      StarterBoxStruct: [
        { name: "walletAddress", type: "address" },
        { name: "id", type: "string" },
        { name: "tokenId", type: "uint256" },
        { name: "numberTokens", type: "uint256" },
        { name: "nonce", type: "string" },
      ],
    };

    // Generate nonce as transaction id
    const boxTokenId = BigNumber.from(tokenId);
    const numberTokens = BigNumber.from(nftNum);
    const voucher = {
      walletAddress,
      id,
      tokenId: boxTokenId,
      numberTokens: numberTokens,
      nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      boxTokenId: boxTokenId.toString(),
      numberTokens: numberTokens.toString(),
    };
  }

  async generateSignedTxOffer(
    walletAddress: string,
    id: string,
    listItemPrice: any,
    listTokenAddress: any
  ): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;
    const contracts = await getAllItemBlockchain();
    if (item.walletId.toLowerCase() != walletAddress.toLowerCase()) {
      throw new HttpException(400, "You can not offer this Box", "INVALID_AUTH");
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

    const nonce = uuidv4();
    const tokenId = BigNumber.from(item.tokenId);
    const price = listItemPrice.map((i: any) => {
      return i?.toLocaleString("fullwide", { useGrouping: false });
    });

    // Generate nonce as transaction id
    const orderItem = {
      walletAddress,
      id: id,
      itemType: "box",
      extraType: "",
      tokenId: BigNumber.from(item.tokenId),
      itemAddress: contracts.NFTContract.address,
      price: price,
      tokenAddress: listTokenAddress,
      nonce,
    };

    // Sign order and return
    return {
      ...(await genSignatureMarketplace(types, orderItem, auth)),
      tokenId: tokenId.toString(),
      price: price,
      tokenAddress: listTokenAddress,
    };
  }

  async generateSignedTxDeposit(
    walletAddress: string,
    id: string
  ): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;
    const contracts = await getAllItemBlockchain();
    if (
      item.walletId.toLowerCase() != walletAddress.toLowerCase() ||
      item.state != "WALLET"
    ) {
      throw new HttpException(
        400,
        "You can not deposit this Box",
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
      itemType: "box",
      extraType: "",
      nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      tokenId: tokenId.toString(),
    };
  }

  async generateSignedTxWithdraw(
    walletAddress: string,
    id: string
  ): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;
    const contracts = await getAllItemBlockchain();
    if (
      item.walletId.toLowerCase() != walletAddress.toLowerCase() ||
      (!item.isRequestWithdraw && !item.isRequestClaim)
    ) {
      throw new HttpException(
        400,
        "You can not deposit this Box",
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

    const tokenId = BigNumber.from(item.tokenId ? item.tokenId : 0);

    // Generate nonce as transaction id
    const voucher = {
      walletAddress,
      id: item.id,
      itemAddress: contracts.NFTContract.address,
      tokenId: tokenId,
      itemType: "box",
      extraType: "",
      nonce: item.nonce,
    };

    // Sign voucher and return
    return {
      ...(await genSignature(types, voucher, auth)),
      tokenId: tokenId.toString(),
    };
  }

  async generateSignedTxOpenNanoBox(
    walletAddress: string,
    id: string
  ): Promise<any> {
    let result = await this.findBoxService.findOneByUser(id);
    if (!result?.data?.idPartner) {
      result = await this.partnerService.updateNanoBoxPartner(undefined, walletAddress);
    }

    const item = result.data;
    const contracts = await getAllItemBlockchain();

    const user: any = await this.findUsersService.findOne(walletAddress);

    user?.whitelist?.map((rs: {
      isInWhitelist: boolean;
      isCheckValidateWhitelist: boolean;
      name: string;
    }) => {
      if (rs.name === 'nano_box') {
        if (rs.isCheckValidateWhitelist == true && rs.isInWhitelist == false)
          throw new HttpException(
            404,
            `You cannot not ${rs.name} this time`,
            "NOT_IN_WHITELIST!"
          );

      }
    });

    if (!item) {
      throw new HttpException(404, "Box is not found!", "BOX_IS_NOT_FOUND!");
    }
    if (
      item.walletId.toLowerCase() != walletAddress.toLowerCase() ||
      !item.isNanoBox ||
      item.isOpened
    ) {
      throw new HttpException(
        400,
        "You can not claim this Box!",
        "CAN_NOT_CLAIM_BOX!"
      );
    }

    // Authenticator for voucher
    const authGame = {
      signer: contracts.deployer,
      contract: contracts.gameContract.address,
    };

    const authNFT = {
      signer: contracts.deployer,
      contract: contracts.NFTContract.address,
    };

    // Specific order structure
    const typesGame = {
      DepositItemFromNFTStruct: [
        { name: "id", type: "string" },
        { name: "itemAddress", type: "address" },
        { name: "itemType", type: "string" },
        { name: "extraType", type: "string" },
        { name: "nonce", type: "string" },
      ],
    };

    const typesNFT = {
      NanoBoxStruct: [
        { name: "walletAddress", type: "address" },
        { name: "id", type: "string" },
        { name: "nonce", type: "string" },
      ],
    };

    const voucherNFT = {
      walletAddress,
      id: item.id,
      nonce: item.nonce,
    };

    const voucherGame = {
      id: item.id,
      itemAddress: contracts.NFTContract.address,
      itemType: "nft",
      extraType: item.nftTypes[0]?.toLowerCase(),
      nonce: item.nonce,
    };

    const signatureNFT = await genSignature(typesNFT, voucherNFT, authNFT);
    const signatureGame = await genSignature(typesGame, voucherGame, authGame);

    // Sign voucher and return
    return {
      hasSignexTx: true,
      data: {
        walletAddress,
        id: item.id,
        nonce: item.nonce,
        signatureNFT: signatureNFT.signature,
        itemType: item.type?.toLowerCase(),
        extraType: "",
        signatureGame: signatureGame.signature,
      },
    };
  }
}


