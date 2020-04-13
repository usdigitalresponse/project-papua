/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

import { getTransformer } from "./transformers";

// Import build-time environment variables from the .env
// See: scripts/compile-function.sh
import { config as dotenv } from "dotenv";
import { downloadClaims } from "./download";

export interface Config {
  // "2020-04-12"
  // Defaults to the current day in UTC.
  day: string;
  // "04"
  // Defaults to the previous hour in UTC.
  hour: string;
}

export async function handler(event: Partial<Config>) {
  const env = dotenv();

  // By default, we'll run on claims from the previous hour.
  // However, we can override this with the Lambda's input event.
  const now = new Date();
  now.setHours(now.getHours() - 1);
  const defaultDay = `${now.getUTCFullYear()}-${pad(
    now.getUTCMonth() + 1
  )}-${pad(now.getUTCDate())}`;
  const defaultHour = pad(now.getUTCHours() - 1);

  const cfg: Config = {
    day: event.day || defaultDay,
    hour: event.hour || defaultHour,
  };

  const transformer = getTransformer();

  const claims = await downloadClaims(cfg);
  const result = await transformer(cfg, claims);

  return {
    rawBucket: process.env.RAW_S3_BUCKET_NAME,
    result,
    env,
    event,
    cfg,
  };
}

function pad(n: number): string {
  return ("0" + String(n)).slice(-2);
}
