import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateReviewRequest } from '../../requests/CreateReviewRequest'
import { ReviewItem } from '../../models/ReviewItem';
import { createLogger } from '../../utils/logger'
import { createReview } from '../../businessLogic/createReview';

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    logger.info('Creating new Review')
    
    //Create new review item
    const newReview: CreateReviewRequest = JSON.parse(event.body)
    //Call Business Logic Layer to create new Review item
    const reviewItem: ReviewItem = await createReview(event, newReview);

    // Return SUCCESS
    logger.info('Create Review Successful!', { reviewItem });
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: reviewItem })
    }
  }
  catch (e) 
  {
    logger.error('Create Review Failed!', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
