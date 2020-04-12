/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

export async function handler() {
  // TODO implement

  const version = "v0.0.3";

  const response = {
    statusCode: 200,
    body: JSON.stringify(`Hello from Lambda! (version=${version})`),
  };

  console.log(`responding to a lambda invocation! (version=${version}; raw-bucket=${process.env.RAW_S3_BUCKET_NAME})`);

  return response;
}
