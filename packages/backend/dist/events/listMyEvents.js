"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const handler = async (event) => {
    try {
        const user = (0, auth_1.authUser)(event);
        if (user.role !== "organizer") {
            return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
        }
        const result = await (0, db_1.scanItems)({
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
    }
    catch (err) {
        console.error("Error listing my events:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
