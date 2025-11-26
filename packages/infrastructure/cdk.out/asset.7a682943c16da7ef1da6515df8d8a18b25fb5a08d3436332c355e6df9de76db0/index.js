"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// packages/backend/dist/lib/db.js
var require_db = __commonJS({
  "packages/backend/dist/lib/db.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.queryItems = exports2.deleteItem = exports2.scanItems = exports2.putItem = exports2.getItem = exports2.db = void 0;
    var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
    var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
    var client = new client_dynamodb_1.DynamoDBClient({});
    exports2.db = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    var getItem = (PK, SK) => exports2.db.send(new lib_dynamodb_1.GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK, SK }
    }));
    exports2.getItem = getItem;
    var putItem = (item) => exports2.db.send(new lib_dynamodb_1.PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item
    }));
    exports2.putItem = putItem;
    var scanItems = (params) => exports2.db.send(new lib_dynamodb_1.ScanCommand({ TableName: process.env.TABLE_NAME, ...params }));
    exports2.scanItems = scanItems;
    var deleteItem = (PK, SK) => exports2.db.send(new lib_dynamodb_1.DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { PK, SK }
    }));
    exports2.deleteItem = deleteItem;
    var queryItems = (params) => exports2.db.send(new lib_dynamodb_1.QueryCommand({ TableName: process.env.TABLE_NAME, ...params }));
    exports2.queryItems = queryItems;
  }
});

// packages/backend/dist/events/listEvents.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var db_1 = require_db();
var handler = async () => {
  try {
    const result = await (0, db_1.scanItems)({
      FilterExpression: "begins_with(PK, :prefix)",
      ExpressionAttributeValues: {
        ":prefix": "EVENT#"
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || [])
    };
  } catch (err) {
    console.error("Error listing events:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Server error" })
    };
  }
};
exports.handler = handler;
