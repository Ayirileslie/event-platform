import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as path from "path";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "EventTable", {
      tableName: "EventTable",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const createLambda = (name: string, file: string) =>
      new NodejsFunction(this, name, {
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
      integration: new HttpLambdaIntegration("SignupIntegration", signupLambda),
    });
    httpApi.addRoutes({
      path: "/auth/login",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("LoginIntegration", loginLambda),
    });

    // Event Routes
    httpApi.addRoutes({
      path: "/events/all",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ListEventsIntegration", listEventsLambda),
    });
    httpApi.addRoutes({
      path: "/events/my-events",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ListMyEventsIntegration", listMyEventsLambda),
    });
    httpApi.addRoutes({
      path: "/events/by-date",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ListEventsByDateIntegration", listEventsByDateLambda),
    });
    httpApi.addRoutes({
      path: "/events/create",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("CreateEventIntegration", createEventLambda),
    });
    httpApi.addRoutes({
      path: "/events/{id}",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("GetEventIntegration", getEventLambda),
    });
    httpApi.addRoutes({
      path: "/events/{id}/registrations",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("GetEventRegistrationsIntegration", getEventRegistrationsLambda),
    });

    // Registration Routes
    httpApi.addRoutes({
      path: "/events/register",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("RegisterIntegration", registerLambda),
    });
    httpApi.addRoutes({
      path: "/events/cancel",
      methods: [apigateway.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration("CancelRegistrationIntegration", cancelRegistrationLambda),
    });
    httpApi.addRoutes({
      path: "/registrations",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ListMyRegistrationsIntegration", listMyRegistrationsLambda),
    });

    new cdk.CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
    new cdk.CfnOutput(this, "TableName", { value: table.tableName });
  }
}
