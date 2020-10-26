import 'source-map-support/register';
//import { ReviewItem } from '../models/ReviewItem';
//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DynamoDB } from 'aws-sdk';

const reviewsTable = process.env.REVIEWS_TABLE;
const reviewsIndex = process.env.INDEX_NAME;
//const XAWS = AWSXRay.captureAWS(AWS)
//const docClient = new XAWS.DynamoDB.DocumentClient();
const docClient = new DynamoDB.DocumentClient();

//Get the Reviews from the database
export async function getReviewsFromDatabase(userId: String) {
    const result = await docClient.query({
        TableName: reviewsTable,
        IndexName: reviewsIndex,
        KeyConditionExpression: 'userId=:u',
        ExpressionAttributeValues: {
          ':u': userId
        }
      })
      .promise();

      return result.Items;
}
