import { EventName } from "@/config/eventSetting";
import DiscordService from "@/services/common/discord.service";
import CreateEventService from "@/services/internal/event/create.service";
import {
  getAllItemBlockchain
} from "@/utils/contract";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

const LOG_PATH = "BlockchainConsumer";
const discordService = DiscordService.getInstance();

async function handle(): Promise<void> {
  const createEventService = new CreateEventService();
  const contracts = await getAllItemBlockchain();

  const executeCreateService = async (event: any, eventName: EventName) => {
    const requestId = uuidv4().toString();
    try {
      logger.info(`Handle event ${eventName} - ${requestId}`, {
        path: LOG_PATH,
        event: event,
      });

      await createEventService.execute([event[event.length - 1]]);
    } catch (err: any) {
      logger.error(`Cannot save event: ${err.message} - ${requestId}`, {
        path: LOG_PATH,
        event: event,
        stack: err.stack,
      });
    }
  };

  if (process.env.ALLOW_EVENT_DEPOSIT_NFT == "true") {
    contracts.gameContract.on(EventName.DepositItem, async (...event) => {
      await executeCreateService(event, EventName.DepositItem);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW_NFT == "true") {
    contracts.gameContract.on(EventName.WithdrawItem, async (...event) => {
      await executeCreateService(event, EventName.WithdrawItem);
    });
  }

  if (process.env.ALLOW_EVENT_DEPOSIT_TOKEN == "true") {
    contracts.gameContract.on(EventName.DepositToken, async (...event) => {
      await executeCreateService(event, EventName.DepositToken);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW_TOKEN == "true") {
    contracts.gameContract.on(EventName.WithdrawToken, async (...event) => {
      await executeCreateService(event, EventName.WithdrawToken);
    });
  }

  if (process.env.ALLOW_EVENT_TRANSFER == "true") {
    contracts.NFTContract.on(EventName.Transfer, async (...event) => {
      if (event[0] !== contracts.marketplaceContract.address) {
        await executeCreateService(event, EventName.Transfer);
      }
    });
  }

  if (process.env.ALLOW_EVENT_REDEEM == "true") {
    contracts.NFTContract.on(EventName.Redeem, async (...event) => {
      await executeCreateService(event, EventName.Redeem);
    });
  }

  if (process.env.ALLOW_EVENT_MINTED_STARTER_BOX == "true") {
    contracts.NFTContract.on(EventName.OpenStarterBox, async (...event) => {
      await executeCreateService(event, EventName.OpenStarterBox);
    });
  }

  if (process.env.ALLOW_EVENT_OFFER == "true") {
    contracts.marketplaceContract.on(EventName.Offer, async (...event) => {
      await executeCreateService(event, EventName.Offer);
    });
  }

  if (process.env.ALLOW_EVENT_BUY == "true") {
    contracts.marketplaceContract.on(EventName.Buy, async (...event) => {
      await executeCreateService(event, EventName.Buy);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW == "true") {
    contracts.marketplaceContract.on(EventName.Withdraw, async (...event) => {
      await executeCreateService(event, EventName.Withdraw);
    });
  }

  if (process.env.ALLOW_EVENT_MINTFROMGAME == "true") {
    contracts.NFTContract.on(EventName.MintFromGame, async (...event) => {
      await executeCreateService(event, EventName.MintFromGame);
    });
  }

  if (process.env.ALLOW_EVENT_OPENNANOBOX == "true") {
    contracts.NFTContract.on(EventName.OpenNanoBox, async (...event) => {
      await executeCreateService(event, EventName.OpenNanoBox);
    });
  }

  if (process.env.ALLOW_EVENT_DEPOSITITEMFROMNFT == "true") {
    contracts.gameContract.on(EventName.DepositItemFromNFT, async (...event) => {
      await executeCreateService(event, EventName.DepositItemFromNFT);
    });
  }

  if (process.env.ALLOW_EVENT_BUYIDO == "true") {
    contracts.seedSaleContract.on(EventName.BuyIDO, async (...event) => {
      await executeCreateService(event, EventName.BuyIDO);
    });
  }

  if (process.env.ALLOW_EVENT_BUYIDO == "true") {
    contracts.publicSaleContract.on(EventName.BuyIDO, async (...event) => {
      await executeCreateService(event, EventName.BuyIDO);
    });
  }

  if (process.env.ALLOW_EVENT_BUYIDO == "true") {
    contracts.privateSaleContract.on(EventName.BuyIDO, async (...event) => {
      await executeCreateService(event, EventName.BuyIDO);
    });
  }

  if (process.env.ALLOW_EVENT_CLAIMIDO == "true") {
    contracts.seedClaimContract.on(EventName.ClaimIDO, async (...event) => {
      await executeCreateService(event, EventName.ClaimIDO);
    });
  }

  if (process.env.ALLOW_EVENT_CLAIMIDO == "true") {
    contracts.publicClaimContract.on(EventName.ClaimIDO, async (...event) => {
      await executeCreateService(event, EventName.ClaimIDO);
    });
  }

  if (process.env.ALLOW_EVENT_CLAIMIDO == "true") {
    contracts.privateClaimContract.on(EventName.ClaimIDO, async (...event) => {
      await executeCreateService(event, EventName.ClaimIDO);
    });
  }
}

handle().catch(async (err) => {
  logger.error(`Could not handle ${LOG_PATH} consumer`, {
    path: LOG_PATH,
    stack: err.stack,
  });

  if (discordService) {
    await discordService.send(
      `Could not handle ${LOG_PATH} consumer`,
      [`Consumer: ${LOG_PATH}`, `stack: ${err.stack}`].join("\n")
    );
  }

  process.exit(1);
});

export const blockchainConsumer = handle;
