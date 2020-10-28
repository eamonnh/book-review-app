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
  Loader
} from 'semantic-ui-react'

import { createReview, deleteTodo, deleteReview, getReviews, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'

interface ReviewsProps {
  auth: Auth
  history: History
}

interface ReviewsState {
  reviews: Review[]
  newReviewName: string
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewsProps, ReviewsState> {
  state: ReviewsState = {
    reviews: [],
    newReviewName: '',
    loadingReviews: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewName: event.target.value })
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
        score: 5,
        summary: "This is the Title of the New Book called XRay Delta Two",
        notes: "This is the test3 notes, This is the test2 notes, This is the test2 notes, This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes. This is the test2 notes, This is the test2 notes.",
        ISBN: "1234567890"
      })
      this.setState({
        reviews: [...this.state.reviews, newReview],
        newReviewName: ''
      })
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
      //const review = this.state.reviews[pos]
      //await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
      //  name: todo.name,
      //  dueDate: todo.dueDate,
      //  done: !todo.done
      //})
      //this.setState({
      //  todos: update(this.state.todos, {
      //    [pos]: { done: { $set: !todo.done } }
      //  })
      //})
    } catch {
      alert('Todo deletion failed')
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
        <Header as="h1">Book Reviews</Header>

        {this.renderCreateReviewInput()}

        {this.renderReviews()}
      </div>
    )
  }

  renderCreateReviewInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onReviewCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
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
