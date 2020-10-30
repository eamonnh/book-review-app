import { apiEndpoint } from '../config'
import { CreateReviewRequest } from '../types/CreateReviewRequest';
import { UpdateReviewRequest } from '../types/UpdateReviewRequest';
import Axios from 'axios'
import { Review } from '../types/Review';

export async function getReviews(idToken: string): Promise<Review[]> {
  console.log('Fetching reviews')

  const response = await Axios.get(`${apiEndpoint}/reviews`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Reviews:', response.data)
  return response.data.Items
}

export async function createReview(
  idToken: string,
  newReview: CreateReviewRequest
): Promise<Review> {
  const response = await Axios.post(`${apiEndpoint}/reviews`,  JSON.stringify(newReview), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchReview(
  idToken: string,
  reviewId: string,
  updatedReview: UpdateReviewRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/reviews/${reviewId}`, JSON.stringify(updatedReview), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteReview(
  idToken: string,
  reviewId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/reviews/${reviewId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  reviewId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/reviews/${reviewId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
