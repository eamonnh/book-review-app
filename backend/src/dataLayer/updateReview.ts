import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { DynamoDB } from 'aws-sdk';
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest'
import { createLogger } from '../utils/logger'

const reviewsTable = process.env.REVIEWS_TABLE
//const docClient = new DynamoDB.DocumentClient();
const logger = createLogger('http')
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient();

//Update Review in database
export async function updateReviewInDatabase(updatedReview: UpdateReviewRequest, reviewId: String, userId: String) {

  logger.info('DLL Updating Review',{reviewId});

  await docClient.update({
    TableName: reviewsTable,
    Key: { reviewId, userId },
    UpdateExpression: 'set #title = :t, #reviewedAt = :r, #score = :s, #summary = :su, #notes = :n, #ISBN = :i',
    ExpressionAttributeValues: {
        ':t': updatedReview.title,
        ':r': updatedReview.reviewedAt,
        ':s': updatedReview.score,
        ':su': updatedReview.summary,
        ':n': updatedReview.notes,
        ':i': updatedReview.ISBN
    },
    ExpressionAttributeNames: {
        '#title': 'title',
        '#reviewedAt': 'reviewedAt',
        '#score': 'score',
        '#summary': 'summary',
        '#notes': 'notes',
        '#ISBN': 'ISBN'
    }
    }).promise();
}