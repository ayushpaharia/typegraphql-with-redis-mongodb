import { Request, Response } from "express";
import { User } from "../schema/user.schema";

interface Context {
  req: Request;
  res: Response;
  user: User | null;
}

// Add userId to out SessionData object
declare module "express-session" {
  interface SessionData {
    token: string | number | null;
  }
}

export default Context;
