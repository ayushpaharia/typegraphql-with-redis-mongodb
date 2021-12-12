import {
  getModelForClass,
  index,
  pre,
  prop,
  queryMethod,
  ReturnModelType,
} from "@typegoose/typegoose";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";
import Argon2 from "argon2";
import { Field, ObjectType } from "type-graphql";

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
  findByUsername: AsQueryMethod<typeof findByUsername>;
}

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User["email"],
) {
  return this.findOne({ email });
}
function findByUsername(
  this: ReturnModelType<typeof User, QueryHelpers>,
  username: User["username"],
) {
  return this.findOne({ username });
}

@pre<User>("save", async function name() {
  // Check if passwor is modified
  if (!this.isModified("password")) return;
  this.password = await Argon2.hash(this.password);
})
@index({ email: 1 }, { unique: true })
@queryMethod(findByEmail)
@queryMethod(findByUsername)
@ObjectType()
export class User {
  @Field()
  _id: string;

  @Field(() => String)
  @prop({ required: true, unique: true })
  username: string;

  @Field(() => String)
  @prop({ required: true })
  @prop({ required: true, unique: true })
  email: string;

  @Field(() => String)
  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);
