import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { putItem, getItem, queryItems } from "../lib/db";
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

    // Get event details
    const eventResult = await getItem(`EVENT#${eventId}`, "DETAILS");
    
    if (!eventResult.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: "Event not found" }) };
    }

    // Check if already registered
    const existingReg = await getItem(`REG#${eventId}`, `USER#${user.userId}`);
    
    if (existingReg.Item) {
      return { statusCode: 409, body: JSON.stringify({ error: "Already registered" }) };
    }

    // Check capacity
    const registrationsResult = await queryItems({
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `REG#${eventId}`,
      },
    });

    const currentRegistrations = registrationsResult.Items?.length || 0;
    
    if (currentRegistrations >= eventResult.Item.capacity) {
      return { statusCode: 400, body: JSON.stringify({ error: "Event is at full capacity" }) };
    }

    // Create registration
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
      body: JSON.stringify({ 
        message: "Registered successfully",
        registration,
      }),
    };
  } catch (err: any) {
    console.error("Error registering for event:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
