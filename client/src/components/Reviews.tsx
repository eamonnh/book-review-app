import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'

import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react'

import {  deleteReview, getReviews } from '../api/reviews-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'

interface ReviewsProps {
  auth: Auth
  history: History
}

interface ReviewsState {
  reviews: Review[]
  newReviewName: string
  newReviewReviewedAt: string
  newReviewSummary: string
  newReviewISBN: string
  newReviewScore: number
  newReviewNotes: string
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewsProps, ReviewsState> {
  state: ReviewsState = {
    reviews: [],
    newReviewName: '',
    newReviewReviewedAt: '',
    newReviewSummary: '',
    newReviewISBN: '',
    newReviewScore: 0,
    newReviewNotes: '',
    loadingReviews: true
  }

  onEditButtonClick = (reviewId: string) => {
    this.props.history.push(`/todos/${reviewId}/edit`)
  }

  onReviewNew = () => {
    this.props.history.push(`/reviews/create`)
  }

  onReviewDelete = async (reviewId: string) => {
    try {
      await deleteReview(this.props.auth.getIdToken(), reviewId)
      this.setState({
        reviews: this.state.reviews.filter(review => review.reviewId != reviewId)
      })
    } catch {
      alert('Review deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const reviews = await getReviews(this.props.auth.getIdToken())
      this.setState({
        reviews,
        loadingReviews: false
      })
    } catch (e) {
      alert(`Failed to fetch reviews: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        
        <div>
          <Grid>
            <Grid.Column floated='left' width={6}>
              <Header as="h1">Books I Have Read</Header>
              <h2>Eamonn Hegarty</h2>
            </Grid.Column>
            <Grid.Column floated='right' width={6} textAlign="right">
              <Button
                icon
                color="blue"
                labelPosition="left"
                onClick={() => this.onReviewNew()}
                >
                Create New Review
                <Icon name="file outline" />
              </Button>                  
            </Grid.Column>
          </Grid>
          <p>Tiny summary but detailed notes for each. Use the ISBN number to find it from your local library or anywhere else. This page will constantly update as I read more, so bookmark it if you want to check back in a few months.</p>
        </div>

        {this.renderReviews()}

      </div>
    )
  }

  renderReviews() {
    if (this.state.loadingReviews) {
      return this.renderLoading()
    }

    return this.renderBookReviewList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Reviews
        </Loader>
      </Grid.Row>
    )
  }

  showImage(url: any) {
    if(url === undefined)
      url = 'https://react.semantic-ui.com/images/wireframe/image.png'
    return url
  }

  renderBookReviewList() {
    return (
      <Grid padded>
        {this.state.reviews.map((review, pos) => {
          return (
            <Grid.Row key={review.reviewId}>
              <Grid.Column width={4}>
                <Image src={this.showImage(review.attachmentUrl)} size="medium" wrapped />
              </Grid.Column>
              <Grid.Column width={8}>
                <h3>{review.title.toUpperCase()}</h3>
                <p><b>HOW STRONGLY I RECOMMEND IT: <i>{review.score}</i>/10</b></p>
                <p>{review.summary}</p>
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                <b>DATE READ:</b> {review.reviewedAt}.<br></br>
                <b>ISBN:</b> {review.ISBN}.<br></br><br></br>
                <Button
                  icon
                  labelPosition="left"
                  onClick={() => this.onEditButtonClick(review.reviewId)}
                >
                  Upload Image
                  <Icon name="cloud upload" />
                </Button>
                <br></br><br></br>
                <Button
                  icon
                  labelPosition="left"
                  onClick={() => this.onReviewDelete(review.reviewId)}
                >
                  Delete Review
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
