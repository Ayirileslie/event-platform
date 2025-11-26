import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { queryItems, getItem } from "../lib/db";
import { authUser } from "../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = authUser(event);
    const eventId = event.pathParameters?.id;

    if (!eventId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing event ID" }) };
    }

    // Verify the event belongs to this organizer
    const eventResult = await getItem(`EVENT#${eventId}`, "DETAILS");
    
    if (!eventResult.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: "Event not found" }) };
    }

    if (eventResult.Item.organizerId !== user.userId) {
      return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
    }

    // Get all registrations for this event
    const result = await queryItems({
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `REG#${eventId}`,
      },
    });

    // Fetch user details for each registration
    const registrations = await Promise.all(
      (result.Items || []).map(async (reg) => {
        const userId = reg.SK.replace("USER#", "");
        const userResult = await getItem(`USER#${userId}`, "METADATA");
        
        return {
          ...reg,
          user: userResult.Item ? {
            email: userResult.Item.email,
            role: userResult.Item.role,
          } : null,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        event: eventResult.Item,
        registrations,
        totalRegistrations: registrations.length,
      }),
    };
  } catch (err: any) {
    console.error("Error getting event registrations:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
