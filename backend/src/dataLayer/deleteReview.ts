import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
//import { DynamoDB } from 'aws-sdk';

const reviewsTable = process.env.REVIEWS_TABLE;
const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();;
//const docClient = new DynamoDB.DocumentClient();

//Delete Review from database
export async function deleteReviewInDatabase(reviewId: String, userId: String) {
  const params = {
    TableName: reviewsTable,
    Key: { reviewId, userId }
  };
  await docClient.delete(params).promise();
}