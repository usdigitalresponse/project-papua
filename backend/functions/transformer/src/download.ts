import { s3 } from './s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3-node/commands/ListObjectsV2Command'
import { GetObjectCommand } from '@aws-sdk/client-s3-node/commands/GetObjectCommand'
import pMap from 'p-map'
import { Config } from './index'
import { toPath } from './path'

interface Output {
  path: string
  claims: object[]
}

export async function downloadClaims(cfg: Config): Promise<Output> {
  const bucket = `papua-data-${process.env.ACCT_ID}`

  // Iterate through all keys in this path:
  const path = toPath('claims', cfg)
  let nextToken: string | undefined
  let done = false
  const keys: string[] = []
  while (!done) {
    const resp = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: path,
        ContinuationToken: nextToken,
      })
    )

    if (resp.Contents) {
      for (const claim of resp.Contents) {
        if (claim.Key) {
          keys.push(claim.Key)
        }
      }
    }

    if (!resp.NextContinuationToken) {
      done = true
    } else {
      nextToken = resp.NextContinuationToken
    }
  }

  // Download and parse all of those claims from S3 (with some parallelism):
  const claims: object[] = []
  await pMap(
    keys,
    async (key) => {
      const resp = await s3.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      )
      if (resp.Body) {
        const body = await streamToString(resp.Body)
        claims.push(JSON.parse(body))
      } else {
        throw new Error(`failed to fetch key (bucket=${bucket}, key=${key})`)
      }
    },
    {
      concurrency: 5,
    }
  )

  return { path, claims }
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: any[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
