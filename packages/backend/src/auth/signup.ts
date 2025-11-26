import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createUser, getUserByEmail } from "../utils/user";
import { signJwt } from "../lib/jwt";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("Signup event:", JSON.stringify(event, null, 2));

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, password, role } = body;

  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email and password required" }) };
  }

  const userRole: "attendee" | "organizer" = role === "organizer" ? "organizer" : "attendee";

  try {
    const existing = await getUserByEmail(email.toLowerCase());
    if (existing.Item) {
      return { statusCode: 409, body: JSON.stringify({ error: "User already exists" }) };
    }

    const user = await createUser(email.toLowerCase(), password, userRole, name);

    const token = signJwt({
      userId: email.toLowerCase(),
      email: email.toLowerCase(),
      role: userRole,
    });

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token, 
        user: {
          _id: email.toLowerCase(),
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          role: userRole,
        },
        message: "Signup successful" 
      }),
    };
  } catch (error: any) {
    console.error("Signup failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
