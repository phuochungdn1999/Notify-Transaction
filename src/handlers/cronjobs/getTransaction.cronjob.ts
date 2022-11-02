import { Blocks } from "@/models/block.model";
import contract from "@config/contracts";
import "dotenv/config";
import { Contract, ethers } from "ethers";
import { DatabaseController } from "../../database/DatabaseController";
import BigNumber from "bignumber.js";
import CronjobService from "@/services/common/cronjob.service";
import { logger } from "@/utils/logger";

const rpc1 = `${process.env.PROVIDER_URL_1}`;
const cronjobService = CronjobService.getInstance();
const LOG_PATH = "GetTransaction";
const defaultInterval = parseInt(process.env.GET_TRANSACTION || "15");

DatabaseController.ConnectDb();

export const getProvider = async () => {
  const mainProvider = new ethers.providers.JsonRpcProvider(rpc1);
  try {
    await mainProvider.getBlockNumber();
    return mainProvider;
  } catch (error) {
    console.log("error: ", error);
  }
};
async function main(): Promise<void> {
  let isRunning = false;

  await cronjobService.create({
    cronTime: `*/${defaultInterval} * * * * *`,
    start: true,
    runOnInit: true,
    onTick: async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;

      try {
        console.log("vao day");
        await excute();
      } catch (err: any) {
        logger.error(`Get Transaction fail: ${err.message}`, {
          path: LOG_PATH,
          stack: err.stack,
        });
      }

      isRunning = false;
    },
  });
}

async function excute() {
  const provider: any = await getProvider();
  const currentBlock = await Blocks.findOne({});
  const latestBlock = await provider.getBlockNumber();
  logger.info(
    `latestBlock ${latestBlock} currentBlock ${currentBlock} ${process.env.PROVIDER_URL_1}`,
    {
      path: LOG_PATH,
    }
  );
  let block: any;

  if (currentBlock) {
    // const block = currentBlock?.blockNumber + 1;
    if (latestBlock > currentBlock.blockNumber) {
      block = currentBlock.blockNumber + 1;
      const data = await provider.getBlockWithTransactions(block);

      console.log("data: ", data.transactions);

      const transactionList = data.transactions.map((value: any) => {
        return {
          blockNumber: block,
          hash: value.hash,
          from: value.from,
          to: value.to,
          data: value.data,
          value: new BigNumber(value.value._hex).toString(),
          hasValidate: false
        };
      });
      logger.info(`Transaction List ${transactionList}`, {
        path: LOG_PATH,
      });
      currentBlock.blockNumber += 1;

      await currentBlock.save();
      // await DatabaseController.updateBlock(currentBlock);
      await DatabaseController.CreateNewTransactions(transactionList);
    }
  } else {
    block = latestBlock;
    const data = await provider.getBlockWithTransactions(block);

    console.log("data: ", data.transactions);

    const transactionList = data.transactions.map((value: any) => {
      return {
        blockNumber: block,
        hash: value.hash,
        from: value.from,
        to: value.to,
        data: value.data,
        value: new BigNumber(value.value._hex).toString(),
        hasValidate: false
      };
    });
    logger.info(`Transaction List ${transactionList}`, {
      path: LOG_PATH,
    });

    // await DatabaseController.updateBlock(currentBlock);
    await DatabaseController.CreateNewTransactions(transactionList);
    await DatabaseController.CreateNewBlock(latestBlock);
  }
  logger.info(`Get transaction from Block ${block}`, {
    path: LOG_PATH,
  });
}

main().catch(async (err) => {
  logger.error(`Could not handle ${LOG_PATH} job`, {
    path: LOG_PATH,
    stack: err.stack,
  });

  process.exit(1);
});
