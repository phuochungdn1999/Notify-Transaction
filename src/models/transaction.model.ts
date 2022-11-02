import { Schema, model } from "mongoose";
export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  data: string;
  value: string;
  hasValidate: boolean;
}

const transactionSchema = new Schema<Transaction>({
  blockNumber: Number,
  hash: String,
  from: String,
  to: String,
  data: String,
  value: String,
  hasValidate: Boolean
});

transactionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});

export const Transactions = model<Transaction>(
  "Transactions",
  transactionSchema
);
