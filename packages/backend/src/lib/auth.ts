import { APIGatewayProxyEventV2 } from "aws-lambda";
import { verifyJwt } from "./jwt";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export const authUser = (event: APIGatewayProxyEventV2): AuthUser => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.substring(7);
  const decoded = verifyJwt(token) as any;

  return {
    userId: decoded.userId || decoded.email,
    email: decoded.email,
    role: decoded.role,
  };
};
