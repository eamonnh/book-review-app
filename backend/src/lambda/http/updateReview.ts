import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateReview } from '../../businessLogic/updateReview';

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    
    //Call BLL
    await updateReview(event);

    // Return SUCCESS
    logger.info('Update Review Successful!');
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }
  catch (e) 
  {
    logger.error('Update Review Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
