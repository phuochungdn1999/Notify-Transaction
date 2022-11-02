import { Transactions } from "@/models/transaction.model";
import { Wallets } from "@/models/wallet.model";
import "dotenv/config";
import { Contract, ethers } from "ethers";
import { DatabaseController } from "../../database/DatabaseController";
import BigNumber from "bignumber.js";
import {
  TransferToken,
  TransferTokenFrom,
  TransferNative,
  SafeTransferFrom,
  Approve,
  ApproveForAll,
} from "../../utils/transaction";
import { Twilio } from "twilio";
import { logger } from "@/utils/logger";
import CronjobService from "@/services/common/cronjob.service";

const rpc1 = `${process.env.PROVIDER_URL_1}`;
const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);
const LOG_PATH = "ReadTransaction";
const defaultInterval = parseInt(process.env.READ_TRANSACTION || "15");
const cronjobService = CronjobService.getInstance();

DatabaseController.ConnectDb();

export const getProvider = async () => {
  const mainProvider = new ethers.providers.JsonRpcProvider(rpc1);
  try {
    await mainProvider.getBlockNumber();
    return mainProvider;
  } catch (error) {
    logger.error(`Could not handle ${LOG_PATH} job`, {
      path: LOG_PATH,
    });
  }
};

async function main(): Promise<void> {
//   let isRunning = false;
  await excute();

//   await cronjobService.create({
//     cronTime: `*/${defaultInterval} * * * * *`,
//     start: true,
//     runOnInit: true,
//     onTick: async () => {
//       if (isRunning) {
//         return;
//       }
//       isRunning = true;

//       try {
//         console.log("vao day");
//         await excute();
//       } catch (err: any) {
//         logger.error(`Get Transaction fail: ${err.message}`, {
//           path: LOG_PATH,
//           stack: err.stack,
//         });
//       }

//       isRunning = false;
//     },
//   });
}

const excute = async () => {
  const provider: any = await getProvider();
  const transactionList = await Transactions.find();
  const wallletList = await Wallets.find();
  const walletArray = wallletList.map((value) => value.walletAddress);
  const phoneArray = wallletList.map((value) => value.phone);
  (phoneArray)
  const promiseArray: any = [];
//   console.log({transactionList})
  console.log({walletArray})
//   console.log({transactionList})


  if (transactionList.length !== 0) {
    transactionList.forEach((value) => {
      if (walletArray.includes(String(value.from).toLowerCase())) {
        // promiseArray.push(decodeTransaction(value, value.from))
        promiseArray.push(decodeTransaction(value, value.from, provider));
      }
    });
    await Promise.all(promiseArray);
  }

};

const decodeTransaction = async (
  transaction: any,
  walletAddress: any,
  provider: any,
) => {
  const encodeFunction = transaction.data.slice(0, 10);
  let message = "";
  let encodeValue;
  let symbol;
  let decimal;
  let value;
  let isNFT = true;
  let idOrValue;
  let owner;
  let isApprovedForAll;
  const contract = new Contract(
    transaction.to,
    [
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );

  switch (encodeFunction) {
    case TransferToken:
      try {
        encodeValue = ethers.utils.defaultAbiCoder.decode(
          ["address", "uint256"],
          ethers.utils.hexDataSlice(transaction.data, 4)
        );
        decimal = await contract.decimals();
        symbol = await contract.symbol();
        if (decimal && symbol) {
          message = `Transfer token ${symbol} from ${walletAddress} to ${encodeValue[0].toString()} value ${new BigNumber(
            encodeValue[1]._hex
          )
            .dividedBy(Math.pow(10, decimal))
            .toString()}`;
        } else {
          message = `Transaction from ${walletAddress} to ${transaction.to}`;
        }
      } catch (error) {
        message = `Transaction from ${walletAddress} to ${transaction.to}`;
      }
      (message);

      break;
    case TransferTokenFrom:
      encodeValue = ethers.utils.defaultAbiCoder.decode(
        ["address", "address", "uint256"],
        ethers.utils.hexDataSlice(transaction.data, 4)
      );
      try {
        symbol = await contract.symbol();
      } catch (error) {
        message = `Transaction from ${walletAddress} to ${transaction.to}`;
      }

      idOrValue = new BigNumber(encodeValue[2]._hex).toString();
      try {
        owner = await contract.ownerOf(idOrValue);
      } catch (error) {
        isNFT = false;
      }
      if (owner && symbol && isNFT) {
        message = `Transfer token ${symbol} id ${idOrValue} from ${walletAddress} to ${encodeValue[1].toString()}`;
      } else {
        try {
          decimal = await contract.decimals();
          message = `Transfer token ${symbol} from ${walletAddress} to ${encodeValue[1].toString()} value ${new BigNumber(
            encodeValue[2]._hex
          )
            .dividedBy(Math.pow(10, decimal))
            .toString()}`;
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to}`;
        }
      }

      (message);
      break;
    case SafeTransferFrom:
      if (transaction.data.length == 202) {
        encodeValue = ethers.utils.defaultAbiCoder.decode(
          ["address", "address", "uint256"],
          ethers.utils.hexDataSlice(transaction.data, 4)
        );

        try {
          symbol = await contract.symbol();
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to}`;
        }

        idOrValue = new BigNumber(encodeValue[2]._hex).toString();
        try {
          owner = await contract.ownerOf(idOrValue);
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to} with value ${value}`;
        }
        if (owner && symbol) {
          message = `Transfer token ${symbol} id ${idOrValue} from ${walletAddress} to ${encodeValue[1].toString()}`;
        }
      } else if (transaction.data.length == 264) {
        encodeValue = ethers.utils.defaultAbiCoder.decode(
          ["address", "address", "uint256", "bytes"],
          ethers.utils.hexDataSlice(transaction.data, 4)
        );

        try {
          symbol = await contract.symbol();
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to}`;
        }

        idOrValue = new BigNumber(encodeValue[2]._hex).toString();
        try {
          owner = await contract.ownerOf(idOrValue);
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to} with value ${value}`;
        }
        if (owner && symbol) {
          message = `Transfer token ${symbol} id ${idOrValue} from ${walletAddress} to ${encodeValue[1].toString()}`;
        }
      }
      (message);
      break;
    case Approve:
      encodeValue = ethers.utils.defaultAbiCoder.decode(
        ["address", "uint256"],
        ethers.utils.hexDataSlice(transaction.data, 4)
      );

      idOrValue = new BigNumber(encodeValue[1]._hex).toString();
      try {
        symbol = await contract.symbol();
      } catch (error) {
        message = `Transaction from ${walletAddress} to ${transaction.to}`;
      }
      try {
        owner = await contract.ownerOf(idOrValue);
      } catch (error) {
        isNFT = false;
      }
      if (owner && symbol && isNFT) {
        message = `Approve token ${symbol} id ${idOrValue} from ${walletAddress} for ${encodeValue[0].toString()}`;
      } else {
        try {
          decimal = await contract.decimals();
          message = `Approve token ${symbol} from ${walletAddress} to ${encodeValue[0].toString()} value ${new BigNumber(
            encodeValue[1]._hex
          )
            .dividedBy(Math.pow(10, decimal))
            .toString()}`;
        } catch (error) {
          message = `Transaction from ${walletAddress} to ${transaction.to}`;
        }
      }

      break;
    case ApproveForAll:
      encodeValue = ethers.utils.defaultAbiCoder.decode(
        ["address", "bool"],
        ethers.utils.hexDataSlice(transaction.data, 4)
      );
      (encodeValue);

      try {
        symbol = await contract.symbol();
      } catch (error) {
        message = `Transaction from ${walletAddress} to ${transaction.to}`;
      }
      try {
        isApprovedForAll = await contract.isApprovedForAll(
          walletAddress,
          encodeValue[0].toString()
        );
        (isApprovedForAll);
      } catch (error) {
        isNFT = false;

        message = `Transaction from ${walletAddress} to ${transaction.to}`;
      }
      if (isNFT) {
        if (encodeValue[1]) {
          message = `Approve token ${symbol} for all from ${walletAddress} for ${encodeValue[0].toString()} set True`;
        } else {
          message = `Approve token ${symbol} for all from ${walletAddress} for ${encodeValue[0].toString()} set False`;
        }
      }

      (message);
      break;
    case TransferNative:
      value = new BigNumber(transaction.value)
        .dividedBy(Math.pow(10, 18))
        .toString();
      message = `Transaction from ${walletAddress} to ${transaction.to} with value ${value}`;
      (message);
      break;

    default:
      message = `Transaction from ${walletAddress} to ${transaction.to} with value ${value}`;
      break;
  }
  const walletData = await Wallets.findOne({walletAddress: walletAddress.toLowerCase()})
  await client.messages.create({
    body: message,
    from: twilioNumber,
    to: String(walletData?.phone),
  });
  transaction.hasValidate = true;
//   await transaction.save()
  logger.info(`Message ${message} send to phone ${walletData?.phone}`, {
    path: LOG_PATH,
  });
};

main().catch(async (err) => {
  logger.error(`Could not handle ${LOG_PATH} job`, {
    path: LOG_PATH,
    stack: err.stack,
  });

  process.exit(1);
});

