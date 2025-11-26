import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { scanItems } from "../lib/db";
import { authUser } from "../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = authUser(event);

    if (user.role !== "organizer") {
      return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
    }

    const result = await scanItems({
      FilterExpression: "begins_with(PK, :prefix) AND organizerId = :orgId",
      ExpressionAttributeValues: {
        ":prefix": "EVENT#",
        ":orgId": user.userId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err: any) {
    console.error("Error listing my events:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
