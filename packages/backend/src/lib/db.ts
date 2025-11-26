import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const db = DynamoDBDocumentClient.from(client);

export const getItem = (pk: string, sk: string) =>
  db.send(new GetCommand({ TableName: process.env.TABLE_NAME!, Key: { pk, sk } }));

export const putItem = (item: Record<string, any>) =>
  db.send(new PutCommand({ TableName: process.env.TABLE_NAME!, Item: item }));

export const scanItems = (params: any) =>
  db.send(new ScanCommand({ TableName: process.env.TABLE_NAME!, ...params }));

export const deleteItem = (pk: string, sk: string) =>
  db.send(new DeleteCommand({ TableName: process.env.TABLE_NAME!, Key: { PK: pk, SK: sk } }));

export const queryItems = (params: any) =>
  db.send(new QueryCommand({ TableName: process.env.TABLE_NAME!, ...params }));
