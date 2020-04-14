import awsServerlessExpress from 'aws-serverless-express'
import app from './app'

const server = awsServerlessExpress.createServer(app);

export async function handler(event: any, context: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    awsServerlessExpress.proxy(server, event, context);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(event)
    };
    context.succeed(response);
}
