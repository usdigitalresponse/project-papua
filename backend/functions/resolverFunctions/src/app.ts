import express from 'express'
import bodyParser from 'body-parser'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import { S3Client } from "@aws-sdk/client-s3-node/S3Client";
import {PutObjectCommand} from "@aws-sdk/client-s3-node/commands/PutObjectCommand";

const s3 = new S3Client({});

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

app.post('/claims', async function(req, res) {
    const now = new Date();
    now.setHours(now.getHours() - 1);
    const defaultDay = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const defaultHour = pad(now.getUTCHours() - 1);

    if (Object.keys(req.body).length === 0) {
        res.json({failure: `body was empty, see:`, body: req.body})
    }

    const uuid = req.body.metadata.uuid
    const key = `claims/day=${defaultDay}/hour=${defaultHour}/${uuid}.json`
    const bucket = `papua-data-${process.env.ACCT_ID}`
    console.log('INFO: bucket name is ', bucket)

    const putObjectCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(req.body, null,  2),
        ACL: "private",
        ContentType: "application/json; charset=utf-8",
    });

    const upload = await s3.send(putObjectCommand)

    console.log(upload)

    res.json({success: `claim received`, body: upload})
});

app.post('/claims/*', function(req, res) {
    res.json({success: `claim received (no action taken)`})
});

function pad(n: number): string {
    return ("0" + String(n)).slice(-2);
}

export default app