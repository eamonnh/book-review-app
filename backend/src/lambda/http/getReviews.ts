import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { ReviewItem } from '../../models/ReviewItem';
import { createLogger } from '../../utils/logger';
import { getReviews } from '../../businessLogic/getReviews';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    logger.info('Getting reviews')
    const reviewItems = await getReviews(event);

    // Return SUCCESS
    logger.info('Get reviews successful');
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: reviewItems })
    }
  }
  catch (e) 
  {
    logger.error('Get Review Items Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
