import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'

import {
  Divider,
  Grid,
  Header,
  Input
} from 'semantic-ui-react'

import { createReview } from '../api/todos-api'
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

  handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  getTodaysDate(): string {
    
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date.getDate(), 'yyyy-mm-dd') as string
  }

  
  onReviewCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
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
    } catch {
      alert('Review creation failed')
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Create New Book Review</Header>
        
        {this.renderCreateNewReviewInput()}

      </div>
    )
  }

  renderCreateNewReviewInput() {
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
            label="Review Title"
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
            type="date"
            actionPosition="left"
            placeholder="Date book reviewed..."
            onChange={this.handleReviewedAtChange}
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
            list="scores"
            placeholder="Choose score"
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
}
