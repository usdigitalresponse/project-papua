import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import { S3Client } from "@aws-sdk/client-s3-node/S3Client";
import {PutObjectCommand} from "@aws-sdk/client-s3-node/commands/PutObjectCommand";

const s3 = new S3Client({});

const app = express()
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(function(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

app.post('/claims', async function(req: Request, res: Response) {
    const now = new Date();
    now.setHours(now.getHours() - 1);
    const defaultDay = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const defaultHour = pad(now.getUTCHours() - 1);

    if (Object.keys(req.body).length === 0 || !req.body.metadata || !req.body.questions) {
        console.log("bad payload: ", JSON.stringify(req.body))

        // why isnt this firing now?
        res.status(422).json({message: `malformed payload`, body: req.body})
    }

    const uuid = req.body.metadata.uuid
    const key = `claims/day=${defaultDay}/hour=${defaultHour}/${uuid}.json`
    const bucket = `papua-data-${process.env.ACCT_ID}`

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

app.post('/claims/*', function(req: Request, res: Response) {
    res.json({success: `claim received (no action taken)`})
});

function pad(n: number): string {
    return ("0" + String(n)).slice(-2);
}

export default app