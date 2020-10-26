import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteReview } from '../../businessLogic/deleteReview';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const logger = createLogger('http');
  
  try {
    logger.info('Starting delete of review ', event.pathParameters.reviewId);

    await deleteReview(event);
    
    // Return SUCCESS
    logger.info('Delete review Successful!');
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
  catch (e) 
  {
    logger.error('Delete review Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
