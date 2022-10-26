import { tokenRateConfig } from "@/config/tokenRateConfig";
import CacheService from "@/services/common/cache.service";
import RatioService from '@/services/external/ratio/ratio.service';
import { getAllItemBlockchain } from "@/utils/contract";
import { getTokenAddress } from "@/utils/tokenType";
import contract from "@config/contracts";
import { BigNumber } from "ethers";

export default class GetRateExchangeService {
  public cacheService: CacheService | null = CacheService.getInstance();
  private ratioService = new RatioService();

  private async getAmountsOut(
    price: string,
    fromTokenAdress: string,
    toTokenAdress: string
  ): Promise<string> {
    let resolveAddres = [fromTokenAdress, contract.WBNB.address, toTokenAdress];
    const contracts = await getAllItemBlockchain();
    if (
      toTokenAdress === contract.WBNB.address ||
      fromTokenAdress === contract.WBNB.address ||
      toTokenAdress === contract.GENI.address
    ) {
      resolveAddres.splice(1, 1);
    }
    if (
      fromTokenAdress === contract.WBNB.address &&
      toTokenAdress === contract.GENI.address
    ) {
      resolveAddres = [
        contract.WBNB.address,
        contract.BUSD.address,
        contract.GENI.address,
      ];
    }
    const data = (await contracts.dexContract
      .connect(contracts.deployer)
      .getAmountsOut(BigNumber.from(price), resolveAddres)) as any[];
    return data.map((item) => BigNumber.from(item).toString())[data.length - 1];
  }

  async getRateExchangeWithUsdt(price: string) {
    const handle = async () => {
      const result = {} as any;
      for (const tokenType of tokenRateConfig.usdt) {
        try {
          result[tokenType] = await this.getAmountsOut(
            price,
            contract.USDT.address,
            getTokenAddress(tokenType)
          );
        } catch (error) {
          result[tokenType] = 0;
        }
      }
      return result;
    };

    // if (this.cacheService) {
    //   return await this.cacheService.remember(
    //     `rate-exchange:usdt:${price}`,
    //     handle,
    //     20
    //   );
    // }

    return await handle();
  }

  async getRateExchangeToken(price: string, token: string) {
    const handle = async () => {
      const result = {} as any;
      let tokenRate;
      let tokenFrom;
      switch (token.toLocaleUpperCase()) {
        case "BNB":
          tokenRate = tokenRateConfig.bnb;
          tokenFrom = contract.WBNB.address;
          break;
        case "BUSD":
          tokenRate = tokenRateConfig.busd;
          tokenFrom = contract.BUSD.address;
          break;
        default:
          tokenRate = tokenRateConfig.bnb;
          tokenFrom = contract.WBNB.address;
          break;
      }
      console.log({ tokenRate, tokenFrom });
      for (const tokenType of tokenRate) {
        try {
          console.log({ tokenType, test: getTokenAddress(tokenType) });

          result[tokenType] = await this.getAmountsOut(
            price,
            tokenFrom,
            getTokenAddress(tokenType)
          );
        } catch (error) {
          console.log({ error });
          result[tokenType] = 0;
        }
      }
      return result;
    };

    // if (this.cacheService) {
    //   return await this.cacheService.remember(
    //     `rate-exchange:usdt:${price}`,
    //     handle,
    //     20
    //   );
    // }

    return await handle();
  }

  async getRateExchangeWithRunnow(price: string) {
    const handle = async () => {
      const runnowVsUsdt = await this.getAmountsOut(
        price,
        contract.RUNNOW.address,
        getTokenAddress("USDT")
      );
      const geniVsUsdt = await this.getAmountsOut(
        price,
        contract.GENI.address,
        getTokenAddress("USDT")
      );

      return {
        USDT: runnowVsUsdt,
        GENI: BigNumber.from(runnowVsUsdt)
          .mul(BigNumber.from(price))
          .div(BigNumber.from(geniVsUsdt))
          .toString(),
      };
    };

    if (this.cacheService) {
      return await this.cacheService.remember(
        `rate-exchange:runnow:${price}`,
        handle,
        20
      );
    }

    return await handle();
  }

  async getRateExchangeWithGeni(price: string) {
    const handle = async () => {
      const geniVsUsdt = await this.getAmountsOut(
        price,
        contract.GENI.address,
        getTokenAddress("USDT")
      );
      const runnowVsUsdt = await this.getAmountsOut(
        price,
        contract.RUNNOW.address,
        getTokenAddress("USDT")
      );

      return {
        USDT: runnowVsUsdt,
        RUNNOW: BigNumber.from(geniVsUsdt)
          .mul(BigNumber.from(price))
          .div(BigNumber.from(runnowVsUsdt))
          .toString(),
      };
    };

    if (this.cacheService) {
      return await this.cacheService.remember(
        `rate-exchange:geni:${price}`,
        handle,
        20
      );
    }

    return await handle();
  }
}
