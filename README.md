# Book Review Application

## Description

This application allows users to store the book review notes of books they have read.
It takes the format of a blog.
The target audience is individuals looking for an easy way to store their book review notes.
This project is part of the capstone project for my Udacity Cloud Developer Nanodegree.

![Alt text](images/HomePage.PNG?raw=true "Home Page")

# Major Features

* The site is protected by 0Auth security. Each user is uniquely identified and can only see their own book reviews
* Once logged in, the user will be taken to the home page where they can see the book review notes they have created
* There's an option to add a new book review on the Home page
* Book reviews can be deleted
* A bookcover image can be uploaded for each book review

# Technology Stack

The application is split into backend and client applications.

## Backend

### Overview

The backend uses Serverless Framework and configured for AWS. It uses the following AWS Services:

* AWS Lambda & API Gateway - serverless APIs
* AWS CloudWatch - logging
* AWS Xray - tracing
* AWS S3 Buckets - storing bookcover images
* AWS Cloud Formation
* AWS DynamoDB - storing book reviews

### APIs

The following APIs are available:

* `Auth` - authenticates the user using Auth0
* `GetReviews` - gets a list of book reviews for the logged in user
* `CreateReview` - creates a new review for the logged in user
* `UpdateReview` - updates an existing book review for the logged in user
* `DeleteReview` - deletes an existing book review for the logged in user
* `uploadUrl` - allows the logged in user to upload a bookcover image for the specified book review

Note that `CreateReview` and `UpdateReview` have the following validation models applied:

```Json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "my-type",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 10,
      "maxLength": 300
    },
    "reviewedAt": {
      "type": "string",
      "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"
    },
    "score": {
      "type": "number",
      "minimum": 0,
      "maximum": 10
    },
    "summary": {
      "type": "string",
      "minLength": 50,
      "maxLength": 500
    },
    "ISBN": {
      "type": "string",
      "minLength": 8,
      "maxLength": 13
    }
  },
  "required": ["title", "reviewedAt", "score", "summary", "ISBN"]
}
```
### Postman


There's a Postman Collection in the root folder called `Book-Review_App.postman_collection.json` that can be used to test the APIs.


### Database

The book review data is stored in an AWS DynamoDB database table. The table consists of the following fields:

* `userId` (string) - Auth0 user Id
* `reviewId` (string) - unique identifier
* `ISBN` (string) - ISBN number for book
* `createdAt` (string) - Date book review was created
* `notes` (string) - Detailed notes of book review
* `reviewdAt` (string) - Date displayed on site showing user date book was reviewed
* `score` (number) - Rating score between 0 and 10 for book
* `summary` (string) - Brief summary of book review
* `title` (string) - Title of book being reviewed
* `attachmentUrl`  (string) (optional) - URL to bookcover image in S3

### Authentication

The site uses an Auth0 RS256 JsonWebToken Signature Algorithm.

### Tracing

AWS XRay Tracing is enabled for all database and S3 integration.

## Client

The client is built using React and TypeScript. It pulls data from the backend via the APIs.
The required configuration to connect the client with the APIs and Auth0 is as follows:

```ts
export const apiEndpoint = 'https://ermjkacpvi.execute-api.eu-west-1.amazonaws.com/dev'

export const authConfig = {
  domain: 'dev-ywg5i4do.eu.auth0.com',            // Auth0 domain
  clientId: 'AfFuSpaBpxz4B7yOIlz5AJZYKU4cEX99',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
```
See `client\src\config.ts` for more details.

# Installation

## Backend

Open command prompt and ensure you are in the `book-review-app` root folder.

To install the backend project that includes the Serverless installation of the APIs, database and S3, run the following commands:

```powershell
cd backend
npm install
serverless deploy -v
```

## Client

To install and run the client on your local machine, run the following commands:

```powershell
cd client
npm install
npm run start
```
Open your browser and navigate to `http://localhost:3000`
