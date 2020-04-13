import { Transformer } from "./index";
import { S3Client } from "@aws-sdk/client-s3-node/S3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3-node/commands/ListObjectsV2Command";
import { GetObjectCommand } from "@aws-sdk/client-s3-node/commands/GetObjectCommand";
import pMap from "p-map";

export const csv: Transformer = async () => {
  const path = getPath();
  const claims = await downloadClaims(path);

  // TODO: upload as CSV
  console.log(claims);

  return {
    path,
    numClaims: claims.length,
  };
};

async function downloadClaims(path: string): Promise<object[]> {
  const s3 = new S3Client({});

  // Iterate through all keys in this path:
  let nextToken: string | undefined;
  let done = false;
  const keys: string[] = [];
  while (!done) {
    const resp = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.RAW_S3_BUCKET_NAME || "",
        Prefix: path,
        ContinuationToken: nextToken,
      })
    );

    if (resp.Contents) {
      for (const claim of resp.Contents) {
        if (claim.Key) {
          keys.push(claim.Key);
        }
      }
    }

    if (!resp.NextContinuationToken) {
      done = true;
    } else {
      nextToken = resp.NextContinuationToken;
    }
  }

  // Download and parse all of those claims from S3 (with some parallelism):
  const claims: object[] = [];
  await pMap(
    keys,
    async (key) => {
      const resp = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.RAW_S3_BUCKET_NAME || "",
          Key: key,
        })
      );
      if (resp.Body) {
        const body = await streamToString(resp.Body);
        claims.push(JSON.parse(body));
      }
    },
    {
      concurrency: 5,
    }
  );

  return claims;
}

function getPath(): string {
  const now = new Date();
  const day = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
    now.getUTCDate() - 1
  )}`;
  const hour = now.getHours();

  return `claims/day=${day}/hour=${hour}/`;
}

function pad(n: number): string {
  return ("0" + n).slice(-2);
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
