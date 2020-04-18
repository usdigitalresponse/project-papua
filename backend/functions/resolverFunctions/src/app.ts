import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import { S3Client } from '@aws-sdk/client-s3-node/S3Client'
import { PutObjectCommand } from '@aws-sdk/client-s3-node/commands/PutObjectCommand'

const s3 = new S3Client({})

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.post('/claims', async function (req: Request, res: Response) {
  const now = new Date()
  const day = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`
  const hour = pad(now.getUTCHours())

  if (!req.body.metadata || !req.body.questions) {
    res.status(422).json({ message: `malformed payload`, body: req.body })
  }

  const uuid = req.body.metadata.uuid
  const key = `claims/day=${day}/hour=${hour}/${uuid}.json`
  const bucket = `papua-data-${process.env.ACCT_ID}`

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(req.body, null, 2),
    ACL: 'private',
    ContentType: 'application/json; charset=utf-8',
  })

  try {
    const upload = await s3.send(putObjectCommand)
    console.log(`Wrote claim to S3 (${bucket})`, upload)
    res.json({ success: `claim received` })
  } catch (err) {
    console.error(`Failed to write claim to S3 (${bucket})`, err)
    res.status(500).json({ message: 'error putting object to s3' })
  }
})

function pad(n: number): string {
  return ('0' + String(n)).slice(-2)
}

export default app
