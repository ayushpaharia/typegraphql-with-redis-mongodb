import { ApolloError } from "apollo-server";
import MyContext from "../types/MyContext";
import { CreateUserInput, LoginInput } from "../input/user.input";
import { User, UserModel } from "../schema/user.schema";
import Argon2 from "argon2";
import { signJWT } from "../utils/jwt";

function throwDefaultError(errorMessage: string) {
  throw new ApolloError(errorMessage);
}

class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    // Find user by email
    const userWithEmail = (await UserModel.find()
      .findByEmail(input.email)
      .lean()) as User;

    // Find user by username
    const userWithUsername = (await UserModel.find()
      .findByUsername(input.username)
      .lean()) as User;

    if (userWithEmail || userWithUsername) {
      throwDefaultError("User already exists");
    }

    return UserModel.create(input);
  }

  async login(input: LoginInput, { req }: MyContext): Promise<String> {
    // Find user by email
    const user = (await UserModel.find()
      .findByEmail(input.email)
      .lean()) as User;

    if (!user) {
      throwDefaultError("User not found with given email or password");
    }
    // Validate Password

    const isPasswordValid = await Argon2.verify(user.password, input.password);
    if (!isPasswordValid) {
      throwDefaultError("User not found with given email or password");
    }

    // sign JWT
    const token = signJWT({ id: user._id });

    // Setting a express session
    req.session!.token = token;

    return token;
  }

  async logout({ req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve, reject) =>
      req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          reject(false);
        }
        res.clearCookie("qid");
        resolve(true);
      }),
    );
  }

  async findUsers(): Promise<User[]> {
    return UserModel.find().lean();
  }
}

export default UserService;
