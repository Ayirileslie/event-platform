import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { putItem } from "../lib/db";
import { authUser } from "../lib/auth";
import { randomUUID } from "crypto";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = authUser(event);
    
    if (user.role !== "organizer") {
      return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.name || !body.description || !body.date || !body.location || !body.capacity) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const eventId = randomUUID();
    const newEvent = {
      PK: `EVENT#${eventId}`,
      SK: "DETAILS",
      name: body.name,
      description: body.description,
      date: body.date,
      location: body.location,
      capacity: body.capacity,
      organizerId: user.userId,
      createdAt: new Date().toISOString(),
    };

    await putItem(newEvent);

    return {
      statusCode: 200,
      body: JSON.stringify(newEvent),
    };
  } catch (err: any) {
    console.error("Error creating event:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
