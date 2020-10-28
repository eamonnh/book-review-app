import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Segment
} from 'semantic-ui-react'

import { createReview, deleteTodo, deleteReview, getReviews, patchTodo, patchReview } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'

interface ReviewsProps {
  auth: Auth
  history: History
}

interface ReviewsState {
  reviews: Review[]
  newReviewName: string
  newReviewSummary: string
  newReviewISBN: string
  newReviewScore: string
  newReviewNotes: string
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewsProps, ReviewsState> {
  state: ReviewsState = {
    reviews: [],
    newReviewName: '',
    newReviewSummary: '',
    newReviewISBN: '',
    newReviewScore: '',
    newReviewNotes: '',
    loadingReviews: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewName: event.target.value })
  }

  handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewSummary: event.target.value })
  }

  handleISBNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewISBN: event.target.value })
  }

  handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewScore: event.target.value })
  }

  handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewNotes: event.target.value })
  }

  onEditButtonClick = (reviewId: string) => {
    this.props.history.push(`/todos/${reviewId}/edit`)
  }

  onReviewCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const createdAt = this.calculateDueDate()
      const newReview = await createReview(this.props.auth.getIdToken(), {
        createdAt: createdAt,
        title: this.state.newReviewName,
        reviewedAt: createdAt,
        score: this.state.newReviewScore,
        summary: this.state.newReviewSummary,
        notes: this.state.newReviewNotes,
        ISBN: this.state.newReviewISBN
      })
      this.setState({
        reviews: [...this.state.reviews, newReview],
        newReviewName: '',
        newReviewSummary: '',
        newReviewScore: '',
        newReviewNotes: '',
        newReviewISBN: ''
      })
      alert('Review creation successful')
    } catch {
      alert('Review creation failed')
    }
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

  onReviewCheck = async (pos: number) => {
    try {
      const review = this.state.reviews[pos]
      await patchReview(this.props.auth.getIdToken(), review.reviewId, {
        title: review.title,
        reviewedAt: review.reviewedAt,
        score: review.score,
        summary: review.summary,
        notes: review.notes,
        ISBN: review.ISBN
      })
      //this.setState({
      //  reviews: update(this.state.reviews, {
      //    [pos]: { done: { $set: !review.done } }
      //  })
      //})
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
        <Header as="h1">Books I Have Read</Header>
        <div>
          <h2>Eamonn Hegarty</h2>
          <p>Tiny summary but detailed notes for each. Use the ISBN number to find it from your local library or anywhere else. This page will constantly update as I read more, so bookmark it if you want to check back in a few months.</p>
        </div>

        {this.renderBookReviewList()}

        {this.renderCreateReviewInput()}

      </div>
    )
  }

  renderCreateReviewInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} textAlign="center">
          <h2>Create New Book Review</h2>
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Title of book..."
            onChange={this.handleNameChange}
            action={{
              color: 'blue',
              labelPosition: 'right',
              icon: 'add',
              content: 'New Review',
              onClick: this.onReviewCreate
            }}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Summary of book review..."
            onChange={this.handleSummaryChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="ISBN..."
            onChange={this.handleISBNChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Score out of 10..."
            onChange={this.handleScoreChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Book review notes..."
            onChange={this.handleNotesChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderReviews() {
    if (this.state.loadingReviews) {
      return this.renderLoading()
    }

    return this.renderReviewsList()
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

  renderReviewsList() {
    return (
      <Grid padded>
        {this.state.reviews.map((review, pos) => {
          return (
            <Grid.Row key={review.reviewId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onReviewCheck(pos)}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {review.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {review.summary}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(review.reviewId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReviewDelete(review.reviewId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {review.title && (
                <Image src={review.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
