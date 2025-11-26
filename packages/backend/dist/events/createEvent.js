"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const crypto_1 = require("crypto");
const handler = async (event) => {
    try {
        const user = (0, auth_1.authUser)(event);
        if (user.role !== "organizer") {
            return { statusCode: 403, body: JSON.stringify({ error: "Not authorized" }) };
        }
        const body = JSON.parse(event.body || "{}");
        if (!body.name || !body.description || !body.date || !body.location || !body.capacity) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
        }
        const eventId = (0, crypto_1.randomUUID)();
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
        await (0, db_1.putItem)(newEvent);
        return {
            statusCode: 200,
            body: JSON.stringify(newEvent),
        };
    }
    catch (err) {
        console.error("Error creating event:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
