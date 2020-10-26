import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from '../utils/logger';
import { parseUserId } from '../auth/utils';
import { deleteReviewInDatabase } from '../dataLayer/deleteReview';

const logger = createLogger('http');

export async function deleteReview(event: APIGatewayProxyEvent) {

  //const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const userId = 'User1234';
  const reviewId = event.pathParameters.reviewId;

  //Delete review in database
  logger.info('deleting review item: ' + reviewId);
  await deleteReviewInDatabase(reviewId, userId);

}