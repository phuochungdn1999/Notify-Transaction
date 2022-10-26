import RecoverService from "./recover.service";

const recoverService = new RecoverService();

const [contractName, blockNumber] = process.argv.slice(2);

if (!contractName || !blockNumber) {
  throw new Error("Missing contract name or block number");
}

console.log({ contractName, blockNumber });

recoverService.updateRecoveryEvent(
  contractName === "all" ? "" : contractName,
  Number(blockNumber)
);

