"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigatewayv2"));
const aws_apigatewayv2_integrations_1 = require("aws-cdk-lib/aws-apigatewayv2-integrations");
const path = __importStar(require("path"));
class InfrastructureStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new dynamodb.Table(this, "EventTable", {
            tableName: "EventTable",
            partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const createLambda = (name, file) => new aws_lambda_nodejs_1.NodejsFunction(this, name, {
            entry: path.join(__dirname, `../../backend/dist/${file}`),
            handler: "handler",
            runtime: lambda.Runtime.NODEJS_20_X,
            timeout: cdk.Duration.seconds(10),
            environment: {
                TABLE_NAME: table.tableName,
                JWT_SECRET: process.env.JWT_SECRET || "supersecret",
            },
        });
        // Auth Lambdas
        const signupLambda = createLambda("SignupLambda", "auth/signup.js");
        const loginLambda = createLambda("LoginLambda", "auth/login.js");
        // Event Lambdas
        const createEventLambda = createLambda("CreateEventLambda", "events/createEvent.js");
        const listEventsLambda = createLambda("ListEventsLambda", "events/listEvents.js");
        const listMyEventsLambda = createLambda("ListMyEventsLambda", "events/listMyEvents.js");
        const listEventsByDateLambda = createLambda("ListEventsByDateLambda", "events/listEventsByDate.js");
        const getEventLambda = createLambda("GetEventLambda", "events/getEvent.js");
        const getEventRegistrationsLambda = createLambda("GetEventRegistrationsLambda", "events/getEventRegistrations.js");
        // Registration Lambdas
        const registerLambda = createLambda("RegisterLambda", "events/register.js");
        const cancelRegistrationLambda = createLambda("CancelRegistrationLambda", "events/cancelRegistration.js");
        const listMyRegistrationsLambda = createLambda("ListMyRegistrationsLambda", "events/listMyRegistrations.js");
        // Grant DynamoDB permissions to all lambdas
        [
            signupLambda,
            loginLambda,
            createEventLambda,
            listEventsLambda,
            listMyEventsLambda,
            listEventsByDateLambda,
            getEventLambda,
            getEventRegistrationsLambda,
            registerLambda,
            cancelRegistrationLambda,
            listMyRegistrationsLambda,
        ].forEach((fn) => table.grantReadWriteData(fn));
        const httpApi = new apigateway.HttpApi(this, "HttpApi", {
            apiName: "EventPlatformApi",
            corsPreflight: {
                allowOrigins: ["*"],
                allowMethods: [
                    apigateway.CorsHttpMethod.GET,
                    apigateway.CorsHttpMethod.POST,
                    apigateway.CorsHttpMethod.PUT,
                    apigateway.CorsHttpMethod.DELETE,
                    apigateway.CorsHttpMethod.OPTIONS,
                ],
                allowHeaders: ["Content-Type", "Authorization"],
                maxAge: cdk.Duration.days(1),
            },
        });
        // Auth Routes
        httpApi.addRoutes({
            path: "/auth/signup",
            methods: [apigateway.HttpMethod.POST],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("SignupIntegration", signupLambda),
        });
        httpApi.addRoutes({
            path: "/auth/login",
            methods: [apigateway.HttpMethod.POST],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("LoginIntegration", loginLambda),
        });
        // Event Routes
        httpApi.addRoutes({
            path: "/events/all",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("ListEventsIntegration", listEventsLambda),
        });
        httpApi.addRoutes({
            path: "/events/my-events",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("ListMyEventsIntegration", listMyEventsLambda),
        });
        httpApi.addRoutes({
            path: "/events/by-date",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("ListEventsByDateIntegration", listEventsByDateLambda),
        });
        httpApi.addRoutes({
            path: "/events/create",
            methods: [apigateway.HttpMethod.POST],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("CreateEventIntegration", createEventLambda),
        });
        httpApi.addRoutes({
            path: "/events/{id}",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("GetEventIntegration", getEventLambda),
        });
        httpApi.addRoutes({
            path: "/events/{id}/registrations",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("GetEventRegistrationsIntegration", getEventRegistrationsLambda),
        });
        // Registration Routes
        httpApi.addRoutes({
            path: "/events/register",
            methods: [apigateway.HttpMethod.POST],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("RegisterIntegration", registerLambda),
        });
        httpApi.addRoutes({
            path: "/events/cancel",
            methods: [apigateway.HttpMethod.DELETE],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("CancelRegistrationIntegration", cancelRegistrationLambda),
        });
        httpApi.addRoutes({
            path: "/registrations",
            methods: [apigateway.HttpMethod.GET],
            integration: new aws_apigatewayv2_integrations_1.HttpLambdaIntegration("ListMyRegistrationsIntegration", listMyRegistrationsLambda),
        });
        new cdk.CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
        new cdk.CfnOutput(this, "TableName", { value: table.tableName });
    }
}
exports.InfrastructureStack = InfrastructureStack;
