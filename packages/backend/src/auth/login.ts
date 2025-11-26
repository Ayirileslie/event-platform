import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../utils/user";
import { signJwt } from "../lib/jwt";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");
    if (!email || !password) return { statusCode: 400, body: "Missing fields" };

    const user = await getUserByEmail(email);
    if (!user.Item) return { statusCode: 401, body: "Invalid credentials" };

    const valid = await bcrypt.compare(password, user.Item.passwordHash);
    if (!valid) return { statusCode: 401, body: "Invalid credentials" };

    const token = signJwt({ email: user.Item.email, role: user.Item.role });
    return { statusCode: 200, body: JSON.stringify({ token }) };
  } catch {
    return { statusCode: 500, body: "Server error" };
  }
};
