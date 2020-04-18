import { Transformer } from './index'
import { s3 } from '../s3'
import { PutObjectCommand } from '@aws-sdk/client-s3-node/commands/PutObjectCommand'
import { join } from 'path'
import { createObjectCsvStringifier } from 'csv-writer'
import { toPath } from '../path'

export const csv: Transformer = async (cfg, claims) => {
  const path = toPath('csv', cfg)
  await uploadClaims(path, claims)

  return {
    path,
  }
}

async function uploadClaims(path: string, claims: object[]): Promise<void> {
  const headerset = new Set<string>()
  for (const claim of claims) {
    for (const header of Object.keys(claim)) {
      headerset.add(header)
    }
  }
  const headers = [...headerset].sort()

  const csv = createObjectCsvStringifier({
    header: headers,
  })
  const headerString = headers.join(',')
  const body = headerString + '\n' + csv.stringifyRecords(claims)
  const bucket = `papua-data-${process.env.ACCT_ID}`

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: join(path, 'claims.csv'),
      Body: body,
      ACL: 'private',
      ContentType: 'application/csv; charset=utf-8',
    })
  )

  return
}
