import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import { S3Client } from '@aws-sdk/client-s3-node/S3Client'
import { PutObjectCommand } from '@aws-sdk/client-s3-node/commands/PutObjectCommand'
import { validateAnswers } from './validation/validate'

const s3 = new S3Client({
  // Locally, we'll override the S3 endpoint to point at a local dockerized
  // version of S3.
  endpoint: process.env.S3_ENDPOINT || undefined,
  // To override the endpoint, you have to force the path style
  // so that it won't try and insert your bucket name as a subdomain
  // ala `bucket.localhost:4572`.
  forcePathStyle: true,
})

const app = express()
// limit arbitrarily determined, update as necessary
app.use(bodyParser.json({ limit: '5mb' }))

// In production, this API runs behind API Gateway. In that case,
// we need this middleware to extract the HTTP body from the Lambda
// event. Locally, we're directly hitting this express app and therefore
// do not need this middleware.s
if (process.env.NODE_ENV === 'production') {
  app.use(awsServerlessExpressMiddleware.eventContext())
} else {
  // However, when running locally, we don't have the CORS setup
  // from API Gateway. Since the app is running on a different port
  // than this API, we open up CORS locally.
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
}

app.post('/claims', async function (req: Request, res: Response) {
  const now = new Date()
  const day = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`
  const hour = pad(now.getUTCHours())

  if (!req.body.metadata || !req.body.questions) {
    res.status(422).json({ message: `malformed payload`, body: req.body })
    return
  }

  const uuid = req.body.metadata.uuid
  const key = `claims/day=${day}/hour=${hour}/${uuid}.json`
  const bucket = `papua-data-${process.env.ACCT_ID}`

  const errors = validateAnswers(req.body.questions)
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ message: errors, id: uuid })
    return
  }

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
    res.json({ message: 'claim received', id: uuid })
  } catch (err) {
    console.error(`Failed to write claim to S3 (${bucket})`, err)
    res.status(500).json({ message: 'error putting object to s3', id: uuid })
    return
  }
})

function pad(n: number): string {
  return ('0' + String(n)).slice(-2)
}

export { app }
