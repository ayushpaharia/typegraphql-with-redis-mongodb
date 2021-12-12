import { User } from "../schema/user.schema";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import UserService from "../service/user.service";
import { CreateUserInput, LoginInput } from "../input/user.input";
import MyContext from "../types/MyContext";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String)
  async login(@Arg("input") input: LoginInput, @Ctx() context: MyContext) {
    return this.userService.login(input, context);
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: MyContext) {
    return this.userService.logout(context);
  }

  @Query(() => [User])
  async findUsers() {
    return this.userService.findUsers();
  }

  @Query(() => String)
  checkQID(@Ctx() context: MyContext) {
    console.log(context.req.session);
    return JSON.stringify(context.req.session);
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    return context.user;
  }
}
