import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { putItem } from "../lib/db";
import { authUser } from "../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = authUser(event);
    
    if (!user) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const { eventId } = body;

    if (!eventId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing eventId" }) };
    }

    const registration = {
      PK: `REG#${eventId}`,
      SK: `USER#${user.userId}`,
      userId: user.userId,
      eventId,
      registeredAt: new Date().toISOString(),
    };

    await putItem(registration);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registered successfully" }),
    };
  } catch (err: any) {
    console.error("Error registering for event:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
