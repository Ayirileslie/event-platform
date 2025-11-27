"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const jwt_1 = require("./jwt");
const authUser = (event) => {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid authorization header");
    }
    const token = authHeader.substring(7);
    const decoded = (0, jwt_1.verifyJwt)(token);
    // JWT contains: { userId, email, role }
    return {
        userId: decoded.userId || decoded.email, // userId is the primary field
        email: decoded.email,
        role: decoded.role,
    };
};
exports.authUser = authUser;
