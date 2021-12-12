import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field } from "type-graphql";
import { User } from "./user.schema";

export interface SessionDocument extends mongoose.Document {
  user: User["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export class Session {
  @Field()
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: string;

  @Field()
  @prop({ type: Boolean, default: true })
  valid: boolean;

  @Field()
  @prop({ type: String, required: true })
  userAgent: string;
}
export const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});
