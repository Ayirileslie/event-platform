"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const handler = async (event) => {
    try {
        const user = (0, auth_1.authUser)(event);
        const eventId = event.pathParameters?.id;
        if (!eventId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing event ID" }) };
        }
        // Verify the event belongs to this organizer
        const eventResult = await (0, db_1.getItem)(`EVENT#${eventId}`, "DETAILS");
        if (!eventResult.Item) {
            return { statusCode: 404, body: JSON.stringify({ error: "Event not found" }) };
        }
        if (eventResult.Item.organizerId !== user.userId) {
            return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
        }
        // Get all registrations for this event
        const result = await (0, db_1.queryItems)({
            KeyConditionExpression: "PK = :pk",
            ExpressionAttributeValues: {
                ":pk": `REG#${eventId}`,
            },
        });
        // Fetch user details for each registration
        const registrations = await Promise.all((result.Items || []).map(async (reg) => {
            const userId = reg.SK.replace("USER#", "");
            const userResult = await (0, db_1.getItem)(`USER#${userId}`, "METADATA");
            return {
                ...reg,
                user: userResult.Item ? {
                    email: userResult.Item.email,
                    role: userResult.Item.role,
                } : null,
            };
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({
                event: eventResult.Item,
                registrations,
                totalRegistrations: registrations.length,
            }),
        };
    }
    catch (err) {
        console.error("Error getting event registrations:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
