"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../lib/db");
const handler = async (event) => {
    try {
        const startDate = event.queryStringParameters?.startDate;
        const endDate = event.queryStringParameters?.endDate;
        let filterExpression = "begins_with(PK, :prefix)";
        let expressionValues = {
            ":prefix": "EVENT#",
        };
        if (startDate && endDate) {
            filterExpression += " AND #date BETWEEN :start AND :end";
            expressionValues[":start"] = startDate;
            expressionValues[":end"] = endDate;
        }
        else if (startDate) {
            filterExpression += " AND #date >= :start";
            expressionValues[":start"] = startDate;
        }
        else if (endDate) {
            filterExpression += " AND #date <= :end";
            expressionValues[":end"] = endDate;
        }
        const result = await (0, db_1.scanItems)({
            FilterExpression: filterExpression,
            ExpressionAttributeNames: {
                "#date": "date",
            },
            ExpressionAttributeValues: expressionValues,
        });
        // Sort by date
        const sortedEvents = (result.Items || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return {
            statusCode: 200,
            body: JSON.stringify(sortedEvents),
        };
    }
    catch (err) {
        console.error("Error listing events by date:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Server error" }),
        };
    }
};
exports.handler = handler;
