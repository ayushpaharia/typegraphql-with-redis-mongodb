import { IsNumber, Length, Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Length(50, 1000, {
    message: "Description must be between 50 and 1000 characters",
  })
  @Field(() => String)
  description: string;

  @Field(() => Number)
  @IsNumber()
  @Min(1)
  price: number;
}

@InputType()
export class GetProductInput {
  @Field(() => String)
  productId: string;
}
