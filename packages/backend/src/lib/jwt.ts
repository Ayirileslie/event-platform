import jwt from "jsonwebtoken";

export const signJwt = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const verifyJwt = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);
