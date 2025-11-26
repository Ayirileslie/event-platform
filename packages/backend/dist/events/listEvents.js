"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const handler = async () => {
    try {
        const result = await (0, db_1.scanItems)({
            FilterExpression: "begins_with(PK, :prefix)",
            ExpressionAttributeValues: {
                ":prefix": "EVENT#",
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items || []),
        };
    }
    catch (err) {
        console.error("Error listing events:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
