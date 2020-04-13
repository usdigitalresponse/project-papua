import { Transformer } from "./index";
import { S3Client } from "@aws-sdk/client-s3-node/S3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3-node/commands/ListObjectsV2Command";
import { GetObjectCommand } from "@aws-sdk/client-s3-node/commands/GetObjectCommand";
import { PutObjectCommand } from "@aws-sdk/client-s3-node/commands/PutObjectCommand";
import pMap from "p-map";
import { join } from "path";
import { createObjectCsvStringifier } from "csv-writer";

export const csv: Transformer = async () => {
  const input = getPath("claims");
  const output = getPath("csv");

  const claims = await downloadClaims(input);
  await uploadClaims(output, claims);

  return {
    paths: {
      input,
      output,
    },
    numClaims: claims.length,
  };
};

async function downloadClaims(path: string): Promise<object[]> {
  const s3 = new S3Client({});
  const bucket = process.env.RAW_S3_BUCKET_NAME || "";

  // Iterate through all keys in this path:
  let nextToken: string | undefined;
  let done = false;
  const keys: string[] = [];
  while (!done) {
    const resp = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
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
          Bucket: bucket,
          Key: key,
        })
      );
      if (resp.Body) {
        const body = await streamToString(resp.Body);
        claims.push(JSON.parse(body));
      } else {
        throw new Error(`failed to fetch key (bucket=${bucket}, key=${key})`);
      }
    },
    {
      concurrency: 5,
    }
  );

  return claims;
}

function getPath(prefix: string): string {
  const now = new Date();
  const day = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
    now.getUTCDate()
  )}`;
  const hour = pad(now.getUTCHours());

  return join(prefix, `day=${day}/hour=${hour}/`);
}

function pad(n: number): string {
  return ("0" + String(n)).slice(-2);
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function uploadClaims(path: string, claims: object[]): Promise<void> {
  const headerset = new Set<string>();
  for (const claim of claims) {
    for (const header of Object.keys(claim)) {
      headerset.add(header);
    }
  }
  const headers = [...headerset].sort();

  const csv = createObjectCsvStringifier({
    header: headers,
  });
  const headerString = headers.join(",");
  const body = headerString + "\n" + csv.stringifyRecords(claims);

  const s3 = new S3Client({});
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.RAW_S3_BUCKET_NAME || "",
      Key: join(path, "claims.csv"),
      Body: body,
      ACL: "private",
      ContentType: "application/csv; charset=utf-8",
    })
  );

  return;
}
