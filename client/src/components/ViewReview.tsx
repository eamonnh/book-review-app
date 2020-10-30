import Auth from '../auth/Auth'
import { Review } from '../types/Review'
import * as React from 'react'
import { History } from 'history'

interface ReviewProps {
  auth: Auth
  viewReview: Review
  history: History
}

interface ReviewState {
  reviews: Review[]
  newReviewName: string
  newReviewReviewedAt: string
  newReviewSummary: string
  newReviewISBN: string
  newReviewScore: number
  newReviewNotes: string
  loadingReviews: boolean
}

export class ViewReview extends React.PureComponent<ReviewProps, ReviewState> {
  state: ReviewState = {
    reviews: [],
    newReviewName: '',
    newReviewReviewedAt: '',
    newReviewSummary: '',
    newReviewISBN: '',
    newReviewScore: 0,
    newReviewNotes: '',
    loadingReviews: true
  }

  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}
