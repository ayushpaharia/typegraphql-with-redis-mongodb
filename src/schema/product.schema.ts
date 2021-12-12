import { getModelForClass, index, prop } from "@typegoose/typegoose";
import { customAlphabet } from "nanoid";
import { Field, ObjectType } from "type-graphql";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

@ObjectType()
@index({ productId: 1 })
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: "User" })
  user: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => Number)
  @prop({ required: true })
  price: number;

  @Field(() => String)
  @prop({ required: true, default: () => `product_${nanoid()}`, unique: true })
  productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);
