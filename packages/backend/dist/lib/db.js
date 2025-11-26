"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryItems = exports.deleteItem = exports.scanItems = exports.putItem = exports.getItem = exports.db = void 0;
// packages/backend/src/lib/db.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
exports.db = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
// FIXED: Use uppercase PK/SK everywhere
const getItem = (PK, SK) => exports.db.send(new lib_dynamodb_1.GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { PK, SK }
}));
exports.getItem = getItem;
const putItem = (item) => exports.db.send(new lib_dynamodb_1.PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: item
}));
exports.putItem = putItem;
const scanItems = (params) => exports.db.send(new lib_dynamodb_1.ScanCommand({ TableName: process.env.TABLE_NAME, ...params }));
exports.scanItems = scanItems;
const deleteItem = (PK, SK) => exports.db.send(new lib_dynamodb_1.DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: { PK, SK }
}));
exports.deleteItem = deleteItem;
const queryItems = (params) => exports.db.send(new lib_dynamodb_1.QueryCommand({ TableName: process.env.TABLE_NAME, ...params }));
exports.queryItems = queryItems;
