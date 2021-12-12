import JWT from "jsonwebtoken";
import config from "config";

const publicKey = Buffer.from(
  config.get<string>("publicKey"),
  "base64",
).toString("ascii");

const privateKey = Buffer.from(
  config.get<string>("privateKey"),
  "base64",
).toString("ascii");

export function signJWT(payload: any, options?: JWT.SignOptions | undefined) {
  return JWT.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJWT<T>(token: string): T | null {
  try {
    const decoded = JWT.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}
