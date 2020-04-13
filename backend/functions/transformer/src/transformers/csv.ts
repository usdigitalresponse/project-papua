import { Transformer } from './index'
import { S3Client } from '@aws-sdk/client-s3-node/S3Client'
import { ListObjectsV2Command } from '@aws-sdk/client-s3-node/commands/ListObjectsV2Command'

export const csv: Transformer = async () => {
  const path = getPath()
  const claims = await downloadClaims(path)

  // TODO: upload as CSV

  return {
    path,
    numClaims: claims.length,
  }
}

async function downloadClaims(path: string): Promise<object[]> {
  const claims: object[] = []

  const s3 = new S3Client({})
  let nextToken: string | undefined
  let done = false
  while (!done) {
    const resp = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.RAW_S3_BUCKET_NAME || '',
      Prefix: path,
      ContinuationToken: nextToken,
    }))

    if (resp.Contents) {
      for (const claim of resp.Contents) {
        console.log(claim)
      }
    }

    if (!resp.NextContinuationToken) {
      done = true
    } else {
      nextToken = resp.NextContinuationToken
    }
  }
  
  return claims
}

function getPath(): string {
  const now = new Date()
  const day = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()-1}`
  const hour = now.getHours()

  return `claims/day=${day}/hour=${hour}/`
}
