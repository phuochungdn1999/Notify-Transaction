import { ContractName } from '@/config/eventSetting';
import { RecoverEvent } from "@/models/recoverEvent";
import CreateEventService from "@/services/internal/event/create.service";
import {
  getAllItemBlockchain
} from "@/utils/contract";
import { logger } from "@/utils/logger";
import { Contract } from "ethers";
import _ from "lodash";

export default class RecoverEventService {
  private createEventService = new CreateEventService();
  private LOG_PATH = "RecoverEventsCronJob";

  async executeV2(contractName: string, fromBlock: number, toBlock: number, txHash?: string) {
    const contracts = await getAllItemBlockchain();
    const latestBlock = await contracts.gameContract.provider.getBlockNumber();

    switch (contractName) {
      case ContractName.NFT:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.NFTContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for NFTContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.Marketplace:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.marketplaceContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for MarketplaceContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.Game:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.gameContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for GameContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.PrivateClaim:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.privateClaimContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for PrivateClaimContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.PrivateSale:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.privateSaleContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for PrivateSaleContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.PublicClaim:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.publicClaimContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for PublicClaimContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.PublicSale:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.publicSaleContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for PublicSaleContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.SeedClaim:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.seedClaimContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for SeedClaimContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      case ContractName.SeedSale:
        try {
          while (fromBlock < toBlock) {
            const missingEvents = (await this.queryMissingEvents(
              contracts.seedSaleContract,
              latestBlock,
              fromBlock,
              fromBlock + Math.min(5000, toBlock - fromBlock),
              txHash
            )) as any[];
            await this.createEventService.execute(missingEvents, false, false);
            fromBlock += Math.min(5000, toBlock - fromBlock);
          }
          break;
        } catch (err: any) {
          logger.error(`Can not query for SeedSaleContract: ${err.message}`, {
            path: this.LOG_PATH,
            stack: err.stack,
            errors: err.errors
              ? _.map(err.errors, (error) => error.message)
              : undefined,
          });
        }
        break;
      default:
        break;
    }
  }

  async execute() {
    const contracts = await getAllItemBlockchain();
    const latestBlock = await contracts.gameContract.provider.getBlockNumber();

    try {
      const missingEvents = (await this.queryMissingEvents(
        contracts.gameContract,
        latestBlock
      )) as any[];
      await this.createEventService.execute(missingEvents, false, false);
    } catch (err: any) {
      logger.error(`Can not query for GameContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors
          ? _.map(err.errors, (error) => error.message)
          : undefined,
      });
    }

    try {
      const missingEvents = (await this.queryMissingEvents(
        contracts.NFTContract,
        latestBlock
      )) as any[];
      await this.createEventService.execute(missingEvents, false, false);
    } catch (err: any) {
      logger.error(`Can not query for NFTContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors
          ? _.map(err.errors, (error) => error.message)
          : undefined,
      });
    }

    try {
      const missingEvents = (await this.queryMissingEvents(
        contracts.marketplaceContract,
        latestBlock
      )) as any[];
      await this.createEventService.execute(missingEvents, false, false);
    } catch (err: any) {
      logger.error(`Can not query for MarketplaceContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors
          ? _.map(err.errors, (error) => error.message)
          : undefined,
      });
    }
  }

  async queryMissingEvents(
    contract: Contract,
    latestBlock: number,
    fromBlock?: number,
    toBlock?: number,
    txHash?: string,
    limit = 5000,
  ) {
    const contractName = await this.createEventService.getContractName(
      contract.address
    );

    if (contractName) {
      let recoverEvent = await RecoverEvent.findOne({
        where: { contractName: contractName },
      });
      if (!recoverEvent) {
        recoverEvent = await RecoverEvent.create({
          block: latestBlock,
          contractName: contractName,
        });
      }

      // If we don't have any new events
      if (latestBlock == recoverEvent.block) {
        return [];
      }

      // const fromBlock = Number(recoverEvent.block);
      const toBlockLimit = Math.min(Number(recoverEvent.block) + limit, latestBlock);
      console.log({ fromBlock, toBlock });
      let missingEvents = await contract.queryFilter(
        {},
        fromBlock ? fromBlock : Number(recoverEvent.block) + 1,
        toBlock ? Math.min(toBlock, latestBlock) : toBlockLimit
      ); // +1: prevent to get dup event from

      if (!toBlock && !fromBlock) {
        await RecoverEvent.update(
          { block: toBlock },
          { where: { id: recoverEvent.id } }
        );
      }

      if (txHash) {
        let tempArray = [];
        for (let i = 0; i < missingEvents.length; i++) {
          const event = missingEvents[i];
          if (event.transactionHash.toLowerCase() === txHash.toLowerCase()) {
            tempArray.push(event);
          }
        }
        missingEvents = tempArray;
      }
      console.log({ missingEvents });

      return missingEvents;
    }
  }

  async updateRecoveryEventV2() {
    const listContractName = Object.values(ContractName);

    for (let i = 0; i < listContractName.length; i++) {
      process.stdout.write(
        `${i + 1}. ${listContractName[i]}\n`
      );
    }

    process.stdout.write(
      `Please enter number option and from block and to block (there is a comma between the data) \n`
    );
    process.stdin.on("data", async (data) => {
      const option = parseInt(data.toString().split(",")[0].trim());
      const fromBlock = parseInt(data.toString().split(",")[1].trim());
      const toBlock = parseInt(data.toString().split(",")[2].trim());
      console.log({ option, fromBlock, toBlock });

      if (!option || !fromBlock || !toBlock) {
        process.stdout.write(
          `Invalid data input \n`
        );
        process.stdout.end;
      }
      for (let i = 0; i < listContractName.length; i++) {
        if (i == option - 1) {
          this.executeV2(listContractName[i], fromBlock, toBlock);
        }
      }
      process.stdout.end;
    });
  }

  async recoverTransaction() {
    try {
      const contracts = await getAllItemBlockchain();
      process.stdout.write(
        `Please enter transaction hash \n`
      );

      process.stdin.on("data", async (data) => {
        const txHash = data.toString().trim();
        if (!txHash) {
          process.stdout.write(
            `Invalid data input \n`
          );
          process.stdout.end;
        }
        console.log({ txHash });

        let txn = await contracts.provider.getTransaction(txHash);
        if (txn) {
          if (txn.blockNumber) {
            console.log("txn: ", txn);
            const rs = await txn.wait();
            const contractName = await this.createEventService.getContractName(
              rs.logs[0].address
            );
            await this.executeV2(contractName || "", rs.blockNumber, rs.blockNumber + 1, txHash);
          }
        }
        process.stdout.end;
      });

    } catch (error) {
      console.log(error);

    }
  }

  async updateRecoveryEvent(contractName: string, blockNumber: number) {
    await RecoverEvent.update(
      { block: blockNumber },
      { where: { ...(contractName ? { contractName } : {}) } }
    );
  }
}


