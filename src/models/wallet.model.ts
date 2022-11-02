import { Schema, model } from "mongoose";
import { DatabaseController } from "../database/DatabaseController";
export interface Wallet {
  walletAddress: string;
  phone: string;
}

const walletSchema = new Schema<Wallet>({
  walletAddress: String,
  phone: String,
});

walletSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});

export const Wallets = model<Wallet>("Wallets", walletSchema);
