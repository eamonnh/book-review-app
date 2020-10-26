import 'source-map-support/register'
import { ReviewItem } from '../models/ReviewItem';
import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DynamoDB } from 'aws-sdk';

const reviewsTable = process.env.REVIEWS_TABLE
//const XAWS = AWSXRay.captureAWS(AWS)
//const docClient = new XAWS.DynamoDB.DocumentClient();
const docClient = new DynamoDB.DocumentClient();

//Add the new Todo to the database
export async function createReviewInDatabase(reviewItem: ReviewItem) {
  await docClient.put({
      TableName: reviewsTable,
      Item: reviewItem
  }).promise();

}