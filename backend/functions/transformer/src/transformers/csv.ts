import { Transformer } from "./index";
import { S3Client } from "@aws-sdk/client-s3-node/S3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3-node/commands/PutObjectCommand";
import { join } from "path";
import { createObjectCsvStringifier } from "csv-writer";
import { toPath } from "../path";

export const csv: Transformer = async (cfg, claims) => {
  const path = toPath("csv", cfg);
  await uploadClaims(path, claims);

  return {
    path,
  };
};

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
