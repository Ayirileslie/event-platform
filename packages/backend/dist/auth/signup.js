"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const user_1 = require("../utils/user");
const jwt_1 = require("../lib/jwt");
const handler = async (event) => {
    console.log("Signup event:", JSON.stringify(event, null, 2));
    let body;
    try {
        body = event.body ? JSON.parse(event.body) : {};
    }
    catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
    const { email, password, role } = body;
    if (!email || !password) {
        return { statusCode: 400, body: JSON.stringify({ error: "Email and password required" }) };
    }
    const userRole = role === "organizer" ? "organizer" : "attendee";
    try {
        const existing = await (0, user_1.getUserByEmail)(email.toLowerCase());
        if (existing.Item) {
            return { statusCode: 409, body: JSON.stringify({ error: "User already exists" }) };
        }
        const user = await (0, user_1.createUser)(email.toLowerCase(), password, userRole);
        const token = (0, jwt_1.signJwt)({
            sub: `USER#${email.toLowerCase()}`, // safe, unique ID
            email: email.toLowerCase(),
            role: userRole,
        });
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, message: "Signup successful" }),
        };
    }
    catch (error) {
        console.error("Signup failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
};
exports.handler = handler;
