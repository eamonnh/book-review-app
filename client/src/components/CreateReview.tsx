import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'

import {
  Divider,
  Header,
  Input,
  Container,
  Message,
  Segment,
  Form,
  Button,
  Icon
} from 'semantic-ui-react'
import { createReview } from '../api/reviews-api'
import Auth from '../auth/Auth'

interface CreateReviewProps {
  auth: Auth
  history: History
}

interface CreateReviewState {
  newReviewName: string
  newReviewReviewedAt: string
  newReviewSummary: string
  newReviewISBN: string
  newReviewScore: number
  newReviewNotes: string
}

export class CreateReview extends React.PureComponent<CreateReviewProps, CreateReviewState> {
  state: CreateReviewState = {
    newReviewName: '',
    newReviewReviewedAt: '',
    newReviewSummary: '',
    newReviewISBN: '',
    newReviewScore: 0,
    newReviewNotes: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewName: event.target.value })
  }

  handleReviewedAtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewReviewedAt: event.target.value })
  }

  handleSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newReviewSummary: event.target.value })
  }

  handleISBNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewISBN: event.target.value })
  }

  handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewScore: Number(event.target.value) })
  }

  handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReviewNotes: event.target.value }) 
  }

  handleNotes2Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newReviewNotes: event.target.value })
}  

  getTodaysDate(): string {
    
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date.getDate(), 'yyyy-mm-dd') as string
  }
  
  onReviewCreate = async () => {
    try {
      const createdAt = this.getTodaysDate()
      const newReview = await createReview(this.props.auth.getIdToken(), {
        createdAt: createdAt,
        title: this.state.newReviewName,
        reviewedAt: this.state.newReviewReviewedAt,
        score: this.state.newReviewScore,
        summary: this.state.newReviewSummary,
        notes: this.state.newReviewNotes,
        ISBN: this.state.newReviewISBN
      })
      this.setState({
        newReviewName: '',
        newReviewReviewedAt: '',
        newReviewSummary: '',
        newReviewScore: 0,
        newReviewNotes: '',
        newReviewISBN: ''
      })
      alert('Review creation successful')
      this.props.history.push(`/`)
    } catch (e) {
      alert(`Failed to create review: ${e.message}`)
    }
  }

  render() {
    return (
      <div>

        {this.renderNewReviewFields()}

      </div>
    )
  }

  renderNewReviewFields() {
    return (      
      <Container>
        <Segment>
          <div>
            <h2>Create New Book Review</h2>
            <p>
              Please enter the details of the new book review in the form below.<br></br>
              Fields marked with * are mandatory.
            </p>
          </div>
        </Segment>
        <Segment.Group>
          <Segment>
            <Header as="h4">
              Title*
            </Header>
            <Input
              fluid
              minLength="10"
              maxLength="300"
              type="text"
              //label="Book Title and Author*"
              placeholder="Enter between 10 and 300 characters..."
              onChange={this.handleNameChange}
            />
          </Segment>
          <Segment>
            <Header as="h4">
              Date Reviewed*
            </Header>
            <Input
              type="date"
              //label="Date Book Reviewed*"
              placeholder="Select date..."
              onChange={this.handleReviewedAtChange}
            />
          </Segment>
          <Segment as={Form}>
            <Header as="h4">
              Summary*
            </Header>
            <textarea 
              onChange={this.handleSummaryChange}  
              rows={1}
              cols={5} 
            />
          </Segment>
          <Segment>
            <Header as="h4">
              ISBN*
            </Header>
            <Input
              type="Text"
              minLength="8"
              maxLength="13"
              //label="Book ISBN Number*"
              placeholder="Enter between 8 and 13 characters..."
              onChange={this.handleISBNChange}
            />
          </Segment>
          <Segment>
            <Header as="h4">
              Score*
            </Header>
            <Input
              list="scores"
              type="number"
              placeholder="score (0 to 10)"
              onChange={this.handleScoreChange}
            />
            <datalist id='scores'>
              <option value='0'>0</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
              <option value='7'>7</option>
              <option value='8'>8</option>
              <option value='9'>9</option>
              <option value='10'>10</option>
            </datalist>
          </Segment>
          <Segment as={Form}>
            <Header as="h4">
              Notes
            </Header>
            <textarea 
              onChange={this.handleNotes2Change} 
              rows={2}
              cols={5} 
            />
          </Segment>
          <Segment>
            <Button
              icon
              color="blue"
              labelPosition="left"
              onClick={() => this.onReviewCreate()}
              >
              Create New Review
              <Icon name="edit outline" />
            </Button>                  
          </Segment>
        </Segment.Group>
      </Container>
    )
  }
}
