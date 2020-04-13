/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

interface Claim {

}

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


/**********************
 * Example get method *
 **********************/

app.get('/claims', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'get call succeed!', url: req.url});
});

app.get('/claims/*', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'get call succeed!', url: req.url});
});

/****************************
 * Example post method *
 ****************************/

app.post('/claims', async function(req: any, res: any) {
    // Add your code here
    console.log(req)
    const key = "postreq.text"

    const result = await s3.putObject({
        Bucket: "papua-verified",
        Key: `public/validated/${key}`,
        Body: "example text",
        ContentType: "text/plain"
    }).promise();

    console.log(result)

    res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/claims/*', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
 * Example put method *
 ****************************/

app.put('/claims', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/claims/*', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
 * Example delete method *
 ****************************/

app.delete('/claims', async function(req: any, res: any) {
    // Add your code here
    const key = "postreq.text"

    const result = await s3.deleteObject({
        Bucket: "papua-verified",
        Key: `public/validated/${key}`,
        Body: "example text",
        ContentType: "text/plain"
    }).promise();

    console.log(result)

    res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/claims/*', function(req: any, res: any) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

export { app }
