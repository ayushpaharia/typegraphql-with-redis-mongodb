import MyContext from "./types/MyContext";
import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { formatArgumentValidationError } from "./helper/formatArgumentValidationError";
import mongoConnect from "./utils/mongoConnect";
import { redis } from "./redis";
import connectRedis from "connect-redis";
import session from "express-session";
import helmet from "helmet";
import { verifyJWT } from "./utils/jwt";
import { UserModel } from "./schema/user.schema";
import Memoize from "memoizee";
import checkAuth from "./utils/checkAuth";

const GetUserFromContext = async (ctx: MyContext) => {
  const context = ctx;
  const { token } = ctx.req.session;
  if (token) {
    const { id }: any = verifyJWT(token as string);
    if (id) {
      const user = await UserModel.findById(id).lean();
      if (user) {
        context.user = user;
      }
    }
  }
  return context;
};

const MemoizedGetUserFromContext = Memoize(GetUserFromContext);

const bootstrap = async () => {
  // Initialize the GraphQL schema
  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/**/*.ts"],
    authChecker: checkAuth,
  });

  const app = Express();

  // User Express Middleware
  // app.use(morgan("dev"));

  const RedisStore = connectRedis(session);
  const RedisConnectionConfig = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret:
      "dPEwFxvHRse&*5Q@u6Fd#!aRPSxuodHwzchXTu93MovMTF^4yqXfjGrmP5EkyGKhiWxcLEmdUBbfPX*7*o8bYQTw*RoMHfKdvgkTXewQ2mdRNqQfFk6U@VroqJ!ah5E$",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      sameSite: "none" as any,
      // ephemeral: true, // destorys cookie after browser exit
    },
  };
  app.use(session(RedisConnectionConfig));
  app.use(helmet());

  // Create a Apollo server
  const apolloServer = new ApolloServer({
    schema,
    context: async (ctx: MyContext) => {
      const context = await MemoizedGetUserFromContext(ctx);

      return {
        req: context.req,
        res: context.res,
        user: context.user,
      };
    },

    formatError: formatArgumentValidationError(),
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  // Start Apollo Server
  await apolloServer.start();

  // Attach the Apollo server to the Express server
  // Apply Middleware on Apollo server
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: true,
      allowedHeaders: [
        "Content-Type",
        "Content-Length",
        "Authorization",
        "x-token",
        "x-refresh-token",
      ],
    },
  });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 Server started on http://localhost:${PORT}/${apolloServer.graphqlPath}`,
    );
    mongoConnect();
  });
};

console.clear();

bootstrap().catch((err) => console.error(err));
