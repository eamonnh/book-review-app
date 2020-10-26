import 'source-map-support/register';
import * as AWS from 'aws-sdk';
//import * as AWSXRay from 'aws-xray-sdk';
import { DynamoDB } from 'aws-sdk';

const reviewsTable = process.env.REVIEWS_TABLE;
const bucket = process.env.ATTACHMENTS_S3_BUCKET;
//const XAWS = AWSXRay.captureAWS(AWS);
//const docClient = new XAWS.DynamoDB.DocumentClient();
const docClient = new DynamoDB.DocumentClient();

//Update review attachment URL in database
export async function updateReviewURL(reviewId: String, userId: String) {

  const attachmentUrl = `https://${bucket}.s3-eu-west-1.amazonaws.com/${reviewId}.png`;

  await docClient.update({
    TableName: reviewsTable,
    Key: { reviewId, userId },
    UpdateExpression: 'set #attachmentUrl = :a',
    ExpressionAttributeValues: {
        ':a': attachmentUrl
    },
    ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
    }
  }).promise();
}