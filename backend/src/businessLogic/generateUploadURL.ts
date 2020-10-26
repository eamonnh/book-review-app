import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from '../utils/logger';
import { parseUserId } from '../auth/utils';
import { updateReviewURL } from '../dataLayer/updateReviewURL';
import { getAttachmentURL } from '../fileStorage/getAttachmentURL';

const logger = createLogger('http');


export async function generateUploadURL(event: APIGatewayProxyEvent): Promise<String> {

  //const userId = parseUserId(event.headers.Authorization.split(' ')[1]);
  const userId = 'User1234';
  const reviewId = event.pathParameters.reviewId;
  

  logger.info('BLL update review attachment URL: ' + reviewId);

  //Create attachment upload URL
  const uploadURL = await getAttachmentURL(reviewId);

  //Update todo URL in database
  await updateReviewURL(reviewId, userId);
  
  return uploadURL;

}