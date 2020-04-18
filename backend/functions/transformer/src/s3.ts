import { S3Client } from '@aws-sdk/client-s3-node/S3Client'

export const s3 = new S3Client({
  // Locally, we'll override the S3 endpoint to point at a local dockerized
  // version of S3.
  endpoint: process.env.S3_ENDPOINT || undefined,
  // To override the endpoint, you have to force the path style
  // so that it won't try and insert your bucket name as a subdomain
  // ala `bucket.localhost:4572`.
  forcePathStyle: true,
})
