import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { scanItems, getItem } from "../lib/db";
import { authUser } from "../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = authUser(event);

    // Get all registrations for this user
    const result = await scanItems({
      FilterExpression: "SK = :userSk",
      ExpressionAttributeValues: {
        ":userSk": `USER#${user.userId}`,
      },
    });

    // Fetch event details for each registration
    const registrations = await Promise.all(
      (result.Items || []).map(async (reg) => {
        const eventId = reg.PK.replace("REG#", "");
        const eventResult = await getItem(`EVENT#${eventId}`, "DETAILS");
        
        return {
          ...reg,
          event: eventResult.Item || null,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(registrations),
    };
  } catch (err: any) {
    console.error("Error listing my registrations:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
