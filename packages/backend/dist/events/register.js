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
            body: JSON.stringify({ message: "Registered successfully" }),
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
