import CronjobService from "@/services/common/cronjob.service";
import DiscordService from "@/services/common/discord.service";
import RecoverEventService from "@/services/internal/event/recover.service";
import { logger } from "@/utils/logger";
import * as dotenv from "dotenv";
dotenv.config({});

const LOG_PATH = "RecoverEventsCronJob";
const discordService = DiscordService.getInstance();
const cronjobService = CronjobService.getInstance();
const recoverEventService = new RecoverEventService();
let defaultInterval = parseInt(process.env.RECOVER_EVENTS_INTERVAL || "5");

async function handle(): Promise<void> {
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
        await recoverEventService.execute();
      } catch (err: any) {
        logger.error(`Recover missing events failed: ${err.message}`, {
          path: LOG_PATH,
          stack: err.stack,
        });
      }

      isRunning = false;
    },
  });
}

handle().catch(async (err) => {
  logger.error(`Could not handle ${LOG_PATH} job`, {
    path: LOG_PATH,
    stack: err.stack,
  });

  if (discordService) {
    await discordService.send(
      `Could not handle ${LOG_PATH} job`,
      [`Job: ${LOG_PATH}`, `stack: ${err.stack}`].join("\n")
    );
  }

  process.exit(1);
});

export const recoverEventsJob = handle;
