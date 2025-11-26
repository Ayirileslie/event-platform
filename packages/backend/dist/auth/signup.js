"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const user_1 = require("../utils/user");
const jwt_1 = require("../lib/jwt");
const handler = async (event) => {
    try {
        const { email, password, role } = JSON.parse(event.body || "{}");
        if (!email || !password || !role)
            return { statusCode: 400, body: "Missing fields" };
        const existing = await (0, user_1.getUserByEmail)(email);
        if (existing.Item)
            return { statusCode: 409, body: "User already exists" };
        const user = await (0, user_1.createUser)(email, password, role);
        const token = (0, jwt_1.signJwt)({ email, role });
        return { statusCode: 201, body: JSON.stringify({ token }) };
    }
    catch {
        return { statusCode: 500, body: "Server error" };
    }
};
exports.handler = handler;
