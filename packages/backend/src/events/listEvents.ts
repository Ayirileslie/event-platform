import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { scanItems } from "../lib/db";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const result = await scanItems({
      FilterExpression: "begins_with(PK, :prefix)",
      ExpressionAttributeValues: {
        ":prefix": "EVENT#",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err: any) {
    console.error("Error listing events:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
