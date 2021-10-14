/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        image
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCheckIn = /* GraphQL */ `
  query GetCheckIn($id: ID!) {
    getCheckIn(id: $id) {
      id
      title
      location
      sport
      image
      date
      likes
      userID
      type
      createdAt
      comments {
        nextToken
      }
      updatedAt
    }
  }
`;
export const listCheckIns = /* GraphQL */ `
  query ListCheckIns(
    $filter: ModelCheckInFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCheckIns(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      checkInID
      checkIn {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        checkInID
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const checkInsByDate = /* GraphQL */ `
  query CheckInsByDate(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCheckInFilterInput
    $limit: Int
    $nextToken: String
  ) {
    checkInsByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
