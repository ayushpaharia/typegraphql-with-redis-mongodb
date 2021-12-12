import { CreateProductInput, GetProductInput } from "../input/product.input";
import { Product } from "../schema/product.schema";
import ProductSerivce from "../service/product.service";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import MyContext from "../types/MyContext";

@Resolver()
export default class UserResolver {
  @Authorized()
  @Mutation(() => Product)
  async createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() ctx: MyContext,
  ) {
    const user = ctx.user!;
    return ProductSerivce.createProduct({ ...input, user: user?._id });
  }

  @Query(() => Product)
  async findSingleProduct(@Arg("input") input: GetProductInput) {
    return ProductSerivce.findSingleProduct(input);
  }

  @Query(() => [Product])
  async findProducts() {
    return ProductSerivce.findProducts();
  }
}
