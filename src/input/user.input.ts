import { prop } from "@typegoose/typegoose";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @prop({ required: true })
  username: string;

  @Field(() => String)
  @IsEmail({}, { message: "Email is not valid" })
  @prop({ required: true })
  email: string;

  @Field(() => String)
  @Length(6, 255, {
    message: "Password must be atleast 6 or atmost 255 characters long",
  })
  @Field(() => String)
  @prop({ required: true })
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, { message: "Email is not valid" })
  @prop({ required: true })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @prop({ required: true })
  password: string;
}
