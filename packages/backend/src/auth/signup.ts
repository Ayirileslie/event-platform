import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createUser, getUserByEmail } from "../utils/user";
import { signJwt } from "../lib/jwt";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { email, password, role } = JSON.parse(event.body || "{}");
    if (!email || !password || !role) return { statusCode: 400, body: "Missing fields" };

    const existing = await getUserByEmail(email);
    if (existing.Item) return { statusCode: 409, body: "User already exists" };

    const user = await createUser(email, password, role);
    const token = signJwt({ email, role });

    return { statusCode: 201, body: JSON.stringify({ token }) };
  } catch {
    return { statusCode: 500, body: "Server error" };
  }
};
