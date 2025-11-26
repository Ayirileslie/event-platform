"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const auth_1 = require("../lib/auth");
const handler = async (event) => {
    try {
        const user = (0, auth_1.authUser)(event);
        // Get all registrations for this user
        const result = await (0, db_1.scanItems)({
            FilterExpression: "SK = :userSk",
            ExpressionAttributeValues: {
                ":userSk": `USER#${user.userId}`,
            },
        });
        // Fetch event details for each registration
        const registrations = await Promise.all((result.Items || []).map(async (reg) => {
            const eventId = reg.PK.replace("REG#", "");
            const eventResult = await (0, db_1.getItem)(`EVENT#${eventId}`, "DETAILS");
            return {
                ...reg,
                event: eventResult.Item || null,
            };
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(registrations),
        };
    }
    catch (err) {
        console.error("Error listing my registrations:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
