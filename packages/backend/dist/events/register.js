"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const handler = async (event) => {
    try {
        const user = (0, auth_1.authUser)(event);
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
        }
        const body = JSON.parse(event.body || "{}");
        const { eventId } = body;
        if (!eventId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing eventId" }) };
        }
        // Get event details
        const eventResult = await (0, db_1.getItem)(`EVENT#${eventId}`, "DETAILS");
        if (!eventResult.Item) {
            return { statusCode: 404, body: JSON.stringify({ error: "Event not found" }) };
        }
        // Check if already registered
        const existingReg = await (0, db_1.getItem)(`REG#${eventId}`, `USER#${user.userId}`);
        if (existingReg.Item) {
            return { statusCode: 409, body: JSON.stringify({ error: "Already registered" }) };
        }
        // Check capacity
        const registrationsResult = await (0, db_1.queryItems)({
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
        await (0, db_1.putItem)(registration);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Registered successfully",
                registration,
            }),
        };
    }
    catch (err) {
        console.error("Error registering for event:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
