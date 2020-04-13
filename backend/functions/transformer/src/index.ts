/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

import { getTransformer } from "./transformers";

// Import build-time environment variables from the .env
// See: scripts/compile-function.sh
import { config } from "dotenv";

export async function handler() {
  console.log(config());

  const transformer = getTransformer();
  const result = await transformer();

  return {
    rawBucket: process.env.RAW_S3_BUCKET_NAME,
    result,
  };
}
