"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../utils/user");
const jwt_1 = require("../lib/jwt");
const handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body || "{}");
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing email or password" })
            };
        }
        const user = await (0, user_1.getUserByEmail)(email.toLowerCase());
        if (!user.Item) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Invalid credentials" })
            };
        }
        const valid = await bcryptjs_1.default.compare(password, user.Item.passwordHash);
        if (!valid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Invalid credentials" })
            };
        }
        const token = (0, jwt_1.signJwt)({
            userId: user.Item.email,
            email: user.Item.email,
            role: user.Item.role
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
                user: {
                    _id: user.Item.email,
                    name: user.Item.email.split('@')[0], // Extract name from email
                    email: user.Item.email,
                    role: user.Item.role,
                }
            })
        };
    }
    catch (err) {
        console.error("Login error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
exports.handler = handler;
