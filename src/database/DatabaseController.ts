// import { User, Users } from '../dbmodels/User';
// import { UserCharacter, UserCharacters } from '../dbmodels/UserCharacter';
import { connect, model, Model, Schema, SchemaTypes } from 'mongoose';
// import { ServerSocket } from '../servercore/ServerSocket';
// import { Helper } from '../utilities/Helper';
// import { TransactionDetail } from './TransactionDetail';
// import { UserSportItem, UserSportItems } from '../dbmodels/UserSportItem';
// import { Brand, CharacterType, NFTType, SportItemType, SportType } from '../constant/GameConstant';
// import { TeamBox, TeamBoxes } from '../dbmodels/TeamBox';
// import { UserBox, UserBoxes } from '../dbmodels/UserBox';
// // import { UserNFT, UserNFTs } from '../dbmodels/UserNFT';
// import { TransactionHistory, TransactionHistories } from '../dbmodels/TransactionHistory';
// import { v4 as uuidv4 } from 'uuid';
import { Blocks } from '../models/block.model';
import { Transactions } from '../models/transaction.model';
import { Wallets } from '../models/wallet.model';

export class DatabaseController {




  static async ConnectDb() {
    const dbConfig: any = process.env.MONGODB;
    await connect(dbConfig)
      .then(() => {
        console.log('Database connected');
      })
      .catch((error) => {
        console.log('Error connecting to database');
      });
  }

  static CreateNewBlock(blockNumber: number) {
    Blocks.create({
      blockNumber: blockNumber
    })
  }

  static CreateNewTransactions(transactions: any) {
    Transactions.insertMany(transactions)
  }


  static updateBlock(block: any) {
    Blocks.updateOne(block)
  }

  static CreateNewWalletAddress(walletAddress: string, phone: string) {
    Wallets.create({
      walletAddress: String(walletAddress).toLowerCase(),
      phone: phone
    })
  }

  // static async GetListUser(searchBy: string, page: number, limit: number) {
  //   const query = { userName: new RegExp(searchBy, 'i'), isDelete: { $ne: true } };
  //   let data: any = await Users.find(query, { userName: 1, email: 1, token: 1, lastLogin: 1, createdAt: 1, rungemsEarnedToday: 1 }).limit(limit).skip(limit * (page - 1)).exec();
  //   let total: number = await Users.countDocuments(query);
  //   return { data: data, count: total };
  // }


}
