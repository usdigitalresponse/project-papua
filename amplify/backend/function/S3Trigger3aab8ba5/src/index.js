const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// eslint-disable-next-line
exports.handler = async (event, context, callback) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  try {
    const { Body } = await s3.getObject({ bucket, key }).promise();
    console.log('BODY: ', Body);
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }

  // const result = await s3.putObject({
  //   Bucket: "papua-verified",
  //   Key: `public/validated/${key}`,
  //   ACL: 'public-read',
  //   Body: ,
  //   ContentType: "text/plain"
  // }).promise();
  //
  // console.log(result)

  console.log("ok bye!")
};
