import 'source-map-support/register'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils';
import { updateReviewInDatabase } from '../dataLayer/updateReview';

const logger = createLogger('http')

export async function updateReview(event: APIGatewayProxyEvent) {

  const reviewId = event.pathParameters.reviewId
  const updatedReview: UpdateReviewRequest = JSON.parse(event.body)
  //const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const userId = 'User1234'

  //Call DLL to update review in database
  logger.info('BLL Updating Review',{reviewId});
  await updateReviewInDatabase(updatedReview, reviewId, userId);

}