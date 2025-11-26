import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteItem } from "../lib/db";
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

    await deleteItem(`REG#${eventId}`, `USER#${user.userId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registration cancelled successfully" }),
    };
  } catch (err: any) {
    console.error("Error cancelling registration:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
