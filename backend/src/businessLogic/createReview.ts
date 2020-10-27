import 'source-map-support/register'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateReviewRequest } from '../requests/CreateReviewRequest'
import { ReviewItem } from '../models/ReviewItem';
import { v4 as uuid } from 'uuid';
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { createReviewInDatabase } from '../dataLayer/createReview';

const logger = createLogger('http')

export async function createReview(event: APIGatewayProxyEvent,
  createReviewRequest: CreateReviewRequest): Promise<ReviewItem> {

  const reviewId = uuid.v4();
  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  //const userId = 'User1234'
  const createdAt = new Date(Date.now()).toISOString();

  //Build the new Review Item object
  const reviewItem = {
      userId,
      reviewId,
      createdAt,
      title: createReviewRequest.title,
      reviewedAt: createReviewRequest.reviewedAt,
      score: createReviewRequest.score,
      summary: createReviewRequest.summary,
      notes: createReviewRequest.notes,
      ISBN: createReviewRequest.ISBN
  };

  //Add new Todo to database
  logger.info('Storing new review: ' + JSON.stringify(reviewItem));
  await createReviewInDatabase(reviewItem);

  return reviewItem;
}