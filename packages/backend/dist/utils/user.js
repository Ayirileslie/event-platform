"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserByEmail = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../lib/db");
const getUserByEmail = (email) => (0, db_1.getItem)(`USER#${email.toLowerCase()}`, "METADATA");
exports.getUserByEmail = getUserByEmail;
const createUser = async (email, password, role = "attendee", name) => {
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = {
        PK: `USER#${email.toLowerCase()}`,
        SK: "METADATA",
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
    };
    await (0, db_1.putItem)(user);
    return user;
};
exports.createUser = createUser;
