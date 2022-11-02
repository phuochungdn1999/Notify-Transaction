import { Schema, model } from "mongoose";
import { DatabaseController } from "../database/DatabaseController";
export interface Block {
  blockNumber: number;
}

const blockSchema = new Schema<Block>({
  blockNumber: Number,
});

blockSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});

export const Blocks = model<Block>("Blocks", blockSchema);
