import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ReviewItem } from '../models/ReviewItem';
import { createLogger } from '../utils/logger';
import { parseUserId } from '../auth/utils';
import { getReviewsFromDatabase } from '../dataLayer/getReviews';

const logger = createLogger('http');

export async function getReviews(event: APIGatewayProxyEvent) {

  const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  //const userId = 'User1234';

  //Call DLL to get reviews from database
  logger.info('BLL Get Reviews');
  return await getReviewsFromDatabase(userId);
}
