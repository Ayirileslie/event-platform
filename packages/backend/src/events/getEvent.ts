import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getItem } from "../lib/db";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const eventId = event.pathParameters?.id;

    if (!eventId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing event ID" }),
      };
    }

    const result = await getItem(`EVENT#${eventId}`, "DETAILS");

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Event not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (err: any) {
    console.error("Error getting event:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
