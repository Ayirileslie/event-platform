"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const handler = async (event) => {
    try {
        const eventId = event.pathParameters?.id;
        if (!eventId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing event ID" }),
            };
        }
        const result = await (0, db_1.getItem)(`EVENT#${eventId}`, "DETAILS");
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
    }
    catch (err) {
        console.error("Error getting event:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
